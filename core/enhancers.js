import url from "url";

export function requestResponseEnhancer(req, res, next) {
  // --- ENHANCE REQUEST ---
  // Analizza l'URL includendo anche le query string (es. ?sort=asc)
  const parsedUrl = url.parse(req.url, true);
  
  // Salva il path "pulito" da eventuali query string (es. /notes invece di /notes?sort=asc)
  req.path = parsedUrl.pathname; 
  
  // Salva i parametri estratti (es. { sort: 'asc' })
  req.query = parsedUrl.query;   

  // --- ENHANCE RESPONSE ---
  // Aggiunge la scorciatoia per impostare lo status code a catena
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };

  // Aggiunge la scorciatoia per inviare JSON con i corretti Headers
  res.json = function(data) {
    if (!res.hasHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify(data));
  };

  next();
}
