export function jsonBodyParser(req, res, next) {
  // Parsiamo il body solo per le richieste che solitamente lo prevedono
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    let body = "";
    const MAX_SIZE = 1 * 1024 * 1024; // 1 Megabyte
    
    req.on("data", chunk => {
      body += chunk;
      if (body.length > MAX_SIZE) {
        // Distrugge la richiesta per evitare consumo ulteriore di risorse
        req.destroy();
      }
    });

    req.on("end", () => {
      if (req.destroyed) return;
      
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
      next(err);
    });
  } else {
    // Per le richieste come GET o DELETE, proseguiamo oltre ignorando il body
    next();
  }
}
