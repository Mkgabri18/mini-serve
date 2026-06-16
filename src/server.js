import { createServer } from 'node:http';
import { createServer as createMiniServe } from "../lib/index.js";
import { notFoundHandler, globalErrorHandler } from "../lib/middlewares/index.js";
import {
  getNotes,
  getNote,
  createNote,
  editNote,
  removeNote,
} from "../notes/notes.controller.js";

// Creiamo l'app con i middleware built-in abilitati e il logger attivo per sviluppo
const app = createMiniServe({
  useEnhancers: true,
  useBodyParser: true,
  useLogger: true
});

console.log("registering routes......");
app.get("/notes", getNotes);
app.get("/notes/:id", getNote);
app.post("/notes", createNote);
app.put("/notes/:id", editNote);
app.delete("/notes/:id", removeNote);

// Aggiungiamo i gestori di errore opzionali alla fine della catena
app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = createServer(app.handler);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

