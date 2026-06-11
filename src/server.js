import { createServer } from 'node:http';
import { createApp } from "./app.js";
import {
  getNotes,
  getNote,
  createNote,
  editNote,
  removeNote,
} from "../notes/notes.controller.js";

/**
 * Registra le rotte del dominio "notes" sull'istanza dell'app.
 * Per usare mini-serve con un dominio diverso, sostituisci questa funzione
 * e i relativi import con il tuo controller.
 *
 * @param {object} app - L'istanza del server creata da createServer()
 */
function registerRoutes(app) {
  console.log("registering routes......")
  app.get("/notes", getNotes);
  app.get("/notes/:id", getNote);
  app.post("/notes", createNote);
  app.put("/notes/:id", editNote);
  app.delete("/notes/:id", removeNote)
}

const app = createApp(registerRoutes);

const server = createServer(app);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
