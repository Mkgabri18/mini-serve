import { runMiddlewares } from "../core/middlewareRunner.js";
import { getNotes, getNote, createNote, editNote, removeNote } from "../notes/notes.controller.js";
import { route } from "../core/router.js";
import { notFoundHandler, globalErrorHandler } from "../core/errorHandlers.js";
import { requestResponseEnhancer } from "../core/enhancers.js";

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

export function createApp() {
  return function handler(req, res) { 
    runMiddlewares(
      [
        requestResponseEnhancer, // Carica req.query, res.status e res.json
        logger,
        
        // Registrazione Rotte
        route("GET", "/notes", getNotes),
        route("GET", "/notes/:id", getNote),
        route("POST", "/notes", createNote),
        route("PUT", "/notes/:id", editNote),
        route("DELETE", "/notes/:id", removeNote),
        
        // Fallback e Global Error Middlewares
        notFoundHandler,
        globalErrorHandler
      ],
      req,
      res
    );
  };
}
