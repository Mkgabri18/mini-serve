import { route } from "./router.js";
import { runMiddlewares } from "./middlewareRunner.js";
import { requestResponseEnhancer } from "./middlewares/enhancers.js";
import { jsonBodyParser } from "./middlewares/bodyParser.js";
import { logger } from "./middlewares/logger.js";

/**
 * Factory that creates the mini-serve server instance.
 * 
 * @param {Object} [options] - Configuration options for built-in middlewares.
 * @param {boolean} [options.useEnhancers=true] - Whether to register the middleware that enhances req and res.
 * @param {boolean} [options.useBodyParser=true] - Whether to register the JSON body parser for POST/PUT/PATCH.
 * @param {boolean} [options.useLogger=false] - Whether to enable the request logger in console.
 * @returns {Object} Application instance with methods to define routes and register middlewares.
 */
export function createServer(options = {}) {
  const {
    useEnhancers = true,
    useBodyParser = true,
    useLogger = false,
  } = options;

  const middlewares = [];

  // Register built-in middlewares based on options
  if (useEnhancers) {
    middlewares.push(requestResponseEnhancer);
  }
  if (useBodyParser) {
    middlewares.push(jsonBodyParser);
  }
  if (useLogger) {
    middlewares.push(logger);
  }

  const app = {
    /**
     * Registers a generic middleware in the stack.
     */
    use(fn) {
      middlewares.push(fn);
    },

    /**
     * Registers a GET route.
     */
    get(path, ...handler) {
      middlewares.push(route("GET", path, ...handler));
    },

    /**
     * Registers a POST route.
     */
    post(path, ...handler) {
      middlewares.push(route("POST", path, ...handler));
    },

    /**
     * Registers a PUT route.
     */
    put(path, ...handler) {
      middlewares.push(route("PUT", path, ...handler));
    },

    /**
     * Registers a DELETE route.
     */
    delete(path, ...handler) {
      middlewares.push(route("DELETE", path, ...handler));
    },

    /**
     * Registers a PATCH route.
     */
    patch(path, ...handler) {
      middlewares.push(route("PATCH", path, ...handler));
    },

    /**
     * The delegate (req, res) to pass to http.createServer().
     */
    handler(req, res) {
      runMiddlewares(middlewares, req, res);
    },
  };

  return app;
}
