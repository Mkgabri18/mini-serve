import { readFileSync } from "node:fs";
import { createServer } from "../core/server.js";
import { getNotes, getNote, createNote, editNote, removeNote } from "../notes/notes.controller.js";
import { notFoundHandler, globalErrorHandler } from "../middlewares/errorHandlers.js";
import { requestResponseEnhancer } from "../middlewares/enhancers.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";
import { logger } from "../middlewares/logger.js";

export function createApp() {
  const app = createServer();

  // 1. Core Middlewares
  app.use(requestResponseEnhancer); // Inietta req.query, res.status e res.json
  app.use(jsonBodyParser);          // Inietta req.body per JSON automatico
  app.use(logger);

  // 2. Servizio Frontend
  app.get("/", (req, res) => {
    try {
      const htmlPath = new URL("./public/index.html", import.meta.url);
      const html = readFileSync(htmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Errore nel caricamento del frontend");
    }
  });

  // 3. Registrazione Rotte API
  app.get("/notes", getNotes);
  app.get("/notes/:id", getNote);
  app.post("/notes", createNote);
  app.put("/notes/:id", editNote);
  app.delete("/notes/:id", removeNote);

  // 4. Fallback e Global Error
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app.handler; // Espone il delegato per http.createServer in server.js
}
