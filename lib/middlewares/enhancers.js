export function requestResponseEnhancer(req, res, next) {
  // --- ENHANCE REQUEST ---
  // Parse URL including query parameters (e.g. ?sort=asc)
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  // Save pathname stripped of query strings (e.g. /notes instead of /notes?sort=asc)
  req.path = parsedUrl.pathname; 
  
  // Save query parameters as an object (e.g. { sort: 'asc' })
  req.query = Object.fromEntries(parsedUrl.searchParams);   

  // --- ENHANCE RESPONSE ---
  // Adds chainable status code shortcut
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };

  // Adds json helper method to send responses with appropriate Headers
  res.json = function(data) {
    if (!res.hasHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify(data));
  };

  next();
}
