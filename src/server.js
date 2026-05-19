import { createServer } from 'node:http';
import { createApp } from "./app.js";

const app = createApp();

const server = createServer(app);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
})





