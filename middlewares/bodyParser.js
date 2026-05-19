export function jsonBodyParser(req, res, next) {
  // Parsiamo il body solo per le richieste che solitamente lo prevedono
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    let body = "";
    
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
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
