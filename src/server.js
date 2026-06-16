import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createServer as createMiniServe } from "../lib/index.js";
import { notFoundHandler, globalErrorHandler } from "../lib/middlewares/index.js";
import {
  getNotes,
  getNote,
  createNote,
  editNote,
  removeNote,
} from "../notes/notes.controller.js";

// Create the app with built-in middlewares enabled and the logger active for development
const app = createMiniServe({
  useEnhancers: true,
  useBodyParser: true,
  useLogger: true
});

console.log("registering routes......");

// Route to serve the static frontend (local development tests only)
app.get("/", (req, res) => {
  try {
    const htmlPath = new URL("./public/index.html", import.meta.url);
    const html = readFileSync(htmlPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Error loading frontend");
  }
});

app.get("/notes", getNotes);
app.get("/notes/:id", getNote);
app.post("/notes", createNote);
app.put("/notes/:id", editNote);
app.delete("/notes/:id", removeNote);

// Add optional error handlers at the end of the chain
app.use(notFoundHandler);
app.use(globalErrorHandler);

const server = createServer(app.handler);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


