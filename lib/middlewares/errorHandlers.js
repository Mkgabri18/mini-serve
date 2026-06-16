export function notFoundHandler(req, res, next) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
}

export function globalErrorHandler(err, req, res, next) {
  console.error("Global Error Caught:", err.message || err);

  if (res.headersSent) {
    return next(err); // Let Node handle the connection termination
  }
  
  const statusCode = err.status || 500;
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
}
