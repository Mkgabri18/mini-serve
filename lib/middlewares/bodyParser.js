export function jsonBodyParser(req, res, next) {
  // Parse the body only for requests that are expected to contain it
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    let body = "";
    const MAX_SIZE = 1 * 1024 * 1024; // 1 Megabyte
    let limitExceeded = false;
    
    req.on("data", chunk => {
      if (limitExceeded) return;

      body += chunk;
      if (body.length > MAX_SIZE) {
        limitExceeded = true;
        req.pause();

        // Send 413 Payload Too Large response gracefully
        res.status(413).json({ error: "Payload Too Large" });

        // Destroy the socket on the next tick so Node has time to flush the response
        setImmediate(() => {
          req.destroy();
        });
      }
    });

    req.on("end", () => {
      if (limitExceeded || req.destroyed) return;
      
      if (!body) {
        req.body = {};
        return next();
      }
      
      try {
        req.body = JSON.parse(body);
        next();
      } catch (err) {
        const error = new Error("Invalid JSON Payload");
        error.status = 400; // Bad Request
        next(error);
      }
    });

    req.on("error", (err) => {
      if (limitExceeded) return;
      next(err);
    });
  } else {
    // For requests like GET or DELETE, proceed ignoring the body
    next();
  }
}
