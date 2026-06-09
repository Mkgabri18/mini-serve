export function route(method, pathDefinition, ...handlers) {
  // Split the path definition into dynamic parameters and static parts,
  // escaping regex special characters in static parts while extracting parameter names.
  const paramNames = [];
  const parts = pathDefinition.split(/(:[a-zA-Z0-9_]+)/);
  const regexParts = parts.map(part => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      paramNames.push(paramName);
      return "([^/]+)";
    }
    // Escape regex characters in static path parts to avoid weak matches (like '.' matching any character)
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  const pathRegex = new RegExp(`^${regexParts.join("")}/?$`);

  return (req, res, next) => {
    if (req.method === method) {
      // Usiamo req.path (pulito dalle query) se disponibile, altrimenti req.url depurato
      const urlToMatch = req.path || req.url.split('?')[0];
      const match = urlToMatch.match(pathRegex);

      if (match) {
        // Estraiamo i valori dinamici (es. /notes/15 -> req.params.id = "15")
        req.params = {};
        paramNames.forEach((name, index) => {
          req.params[name] = match[index + 1];
        });

        // Run route-specific handlers in sequence
        let i = 0;
        const runNext = (err) => {
          if (err) {
            return next(err); // Forward errors directly to global error handler
          }
          if (i < handlers.length) {
            const handler = handlers[i++];
            try {
              Promise.resolve(handler(req, res, runNext)).catch(runNext);
            } catch (caughtErr) {
              runNext(caughtErr);
            }
          } else {
            next(); // Handlers completed without sending a response, fallback to next outer middleware
          }
        };

        runNext();
        return; // Interrompiamo qui, la route è stata gestita
      }
    }
    
    // Se non c'è match, passiamo al prossimo middleware della catena
    next();
  };
}
