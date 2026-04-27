export function route(method, pathDefinition, handler) {
  // Converte un path come /notes/:id in un array di nomi parametri ["id"]
  // e in una Regex per fare il matching come ^/notes/([^/]+)$
  const paramNames = [];
  const regexPath = pathDefinition.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return "([^/]+)";
  });
  const pathRegex = new RegExp(`^${regexPath}$`);

  return async (req, res, next) => {
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

        try {
          await handler(req, res, next);
        } catch (err) {
          next(err); 
        }
        return; // Interrompiamo qui, la route è stata gestita e il controller chiuderà la request
      }
    }
    
    // Se non c'è match, passiamo al prossimo middleware della catena
    next();
  };
}
