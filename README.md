# mini-serve

A tiny, zero-dependency HTTP framework for Node.js. Designed to be fast, agnostic, and lightweight.

## Features

- 🚀 **Zero dependencies**: Pure Node.js standard library.
- 🛣️ **Custom Router**: Express-like syntax with support for dynamic path parameters (e.g. `/users/:id`).
- 🔄 **Middleware engine**: Support for custom and built-in middlewares (with next() pattern).
- 📦 **Agnostic**: Built to serve any type of API/CRUD project.

## Installation

```bash
npm install mini-serve
```

## Quick Start

Create a server, define your routes, and start listening:

```javascript
import http from 'node:http';
import { createServer } from 'mini-serve';

// Create a server instance with options
const app = createServer({
  useEnhancers: true,  // Adds res.json(), res.status(), req.query
  useBodyParser: true, // Parses request body automatically for POST/PUT/PATCH
  useLogger: true      // Logs requests
});

// Define routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  res.status(201).json({ received: data });
});

// Start the server using native Node.js HTTP server
const server = http.createServer(app.handler);

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Middleware Support

You can register custom middleware using the `.use` method:

```javascript
app.use((req, res, next) => {
  console.log(`Custom middleware: ${req.method} ${req.url}`);
  next();
});
```

You can also import built-in middlewares:

```javascript
import { notFoundHandler, globalErrorHandler } from 'mini-serve/middlewares';

app.use(notFoundHandler);
app.use(globalErrorHandler);
```

## License

MIT
