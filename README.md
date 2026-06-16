# mini-serve

`mini-serve` is an ultra-lightweight, **zero-dependency** HTTP framework for Node.js. It is designed as a minimal, native alternative to Express for building REST APIs, CRUD services, and web servers while maintaining full control over performance and middleware configuration.

---

## Table of Contents
1. [Key Features](#key-features)
2. [Guide: How to Use It in a New Project from Scratch](#guide-how-to-use-it-in-a-new-project-from-scratch)
3. [API Guide](#api-guide)
4. [Middleware Management](#middleware-management)
5. [License](#license)

---

## Key Features

* 🚀 **Zero external dependencies**: Built entirely on top of Node.js native modules (e.g. `node:http`, `node:fs`).
* 🛣️ **Express-like Router**: Native support for HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) and dynamic path parameters (e.g. `/api/users/:id`).
* ⚙️ **Opt-In Modularity**: Built-in middlewares (body parser, request/response enhancers, logger) are configurable and can be enabled or disabled at will.
* 🛡️ **Lightweight & Secure**: Includes a built-in JSON body parser with a default 1MB size limit to prevent potential DOS attacks.

---

## Guide: How to Use It in a New Project from Scratch

Follow these steps to create a new project and use `mini-serve`.

### Step 1: Initialize the Node.js project
Create a new directory for your project and initialize it via terminal:
```bash
mkdir my-new-project
cd my-new-project
npm init -y
```

### Step 2: Enable ES Modules (ESM)
Open the newly generated `package.json` file and add the `"type": "module"` property. This step is critical since `mini-serve` uses modern ES6 import syntax:
```json
{
  "name": "my-new-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

### Step 3: Install `@mkgabri18/mini-serve`
Install the package using npm:
```bash
npm install @mkgabri18/mini-serve
```

### Step 4: Create the Server File (`index.js`)
Create a file named `index.js` in the root of your project and add the following sample code:

```javascript
import http from 'node:http';
import { createServer } from '@mkgabri18/mini-serve';
import { notFoundHandler, globalErrorHandler } from '@mkgabri18/mini-serve/middlewares';

// 1. Initialize the server with the desired options
const app = createServer({
  useEnhancers: true,  // Enables res.json(), res.status(), and req.query
  useBodyParser: true, // Automatically parses JSON body for POST/PUT/PATCH
  useLogger: true      // Logs requests to the console
});

// 2. Define your routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to my new agnostic server!' });
});

// Route with dynamic path parameters
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ itemId: id, queryString: req.query });
});

// POST route with body parser support
app.post('/items', (req, res) => {
  const payload = req.body;
  res.status(201).json({ created: payload });
});

// 3. Register fallback and error handling middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 4. Start the server using Node.js native http module
const server = http.createServer(app.handler);

server.listen(3000, () => {
  console.log('Server successfully started at http://localhost:3000');
});
```

### Step 5: Start the server
Run the server using your terminal:
```bash
npm start
```

---

## API Guide

### `createServer(options)`
Creates an application instance. Accepts a configuration object for built-in middlewares:

| Option | Type | Default | Description |
|---|---|---|---|
| `useEnhancers` | `boolean` | `true` | Injects `req.query`, `req.path`, `res.status(code)`, and `res.json(data)`. |
| `useBodyParser` | `boolean` | `true` | Automatically parses JSON payloads into `req.body` (max limit: 1MB). Returns `413 Payload Too Large` if exceeded, or `400 Bad Request` if JSON is malformed. |
| `useLogger` | `boolean` | `false` | Logs incoming requests, status code, and execution time in ms (e.g.: `[GET] /api/users - 200 (12ms)`). |

The returned `app` object exposes the following methods:
- `app.use(middleware)`: Registers a global middleware or an error-handling middleware.
- `app.get(path, ...handlers)`: Registers a GET route.
- `app.post(path, ...handlers)`: Registers a POST route.
- `app.put(path, ...handlers)`: Registers a PUT route.
- `app.delete(path, ...handlers)`: Registers a DELETE route.
- `app.patch(path, ...handlers)`: Registers a PATCH route.
- `app.handler`: The native callback `(req, res)` to pass to `http.createServer()`.

---

## Middleware Management

Middlewares follow the standard `(req, res, next)` pattern:

```javascript
app.use((req, res, next) => {
  console.log('Request received...');
  next(); // Pass control to the next middleware
});
```

### Global Error Handling
If you pass an error to `next(err)`, the middleware runner skips all standard middlewares to execute error-handling middlewares, which are identified by having 4 arguments `(err, req, res, next)`:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Internal Server Error' }));
});
```

You can also import and use the pre-built error handlers from their submodule:
```javascript
import { notFoundHandler, globalErrorHandler } from '@mkgabri18/mini-serve/middlewares';

app.use(notFoundHandler);     // Handles 404 for unregistered routes
app.use(globalErrorHandler);  // Safely catches and processes uncaught errors
```

---

## License

This project is licensed under the [MIT](LICENSE) License.
