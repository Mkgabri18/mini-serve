import { readFileSync } from "node:fs";
import { createServer } from "../core/server.js";
import { notFoundHandler, globalErrorHandler } from "../middlewares/errorHandlers.js";
import { requestResponseEnhancer } from "../middlewares/enhancers.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";
import { logger } from "../middlewares/logger.js";

/**
 * Factory agnostica del framework mini-serve.
 *
 * @param {function(app): void} registerRoutes - Funzione che riceve l'istanza
 *   dell'app e registra le rotte specifiche del dominio. Viene chiamata dopo
 *   il setup dei middleware core e prima dei fallback di errore.
 * @returns {function} Il delegato (req, res) da passare a http.createServer().
 */
export function createApp(registerRoutes) {
  const app = createServer();

  // 1. Core Middlewares
  app.use(requestResponseEnhancer); // Inietta req.query, res.status e res.json
  app.use(jsonBodyParser);          // Inietta req.body per JSON automatico
  app.use(logger);

  // 2. Frontend statico (opzionale: serve index.html se presente in src/public/)
  app.get("/", (req, res) => {
    try {
      const htmlPath = new URL("./public/index.html", import.meta.url);
      const html = readFileSync(htmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("No frontend found");
    }
  });

  // 3. Rotte del dominio iniettate dall'esterno
  registerRoutes(app);

  // 4. Fallback e Global Error
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app.handler; // Espone il delegato per http.createServer in server.js
}
