import { route } from "./router.js";
import { runMiddlewares } from "./middlewareRunner.js";
import { requestResponseEnhancer } from "./middlewares/enhancers.js";
import { jsonBodyParser } from "./middlewares/bodyParser.js";
import { logger } from "./middlewares/logger.js";

/**
 * Factory che crea l'istanza del server mini-serve.
 * 
 * @param {Object} [options] - Opzioni di configurazione dei middleware built-in.
 * @param {boolean} [options.useEnhancers=true] - Se registrare il middleware che arricchisce req e res.
 * @param {boolean} [options.useBodyParser=true] - Se registrare il parser JSON del body per POST/PUT/PATCH.
 * @param {boolean} [options.useLogger=false] - Se abilitare il logger delle richieste in console.
 * @returns {Object} Istanza dell'applicazione con i metodi per definire le rotte e registrare middleware.
 */
export function createServer(options = {}) {
  const {
    useEnhancers = true,
    useBodyParser = true,
    useLogger = false,
  } = options;

  const middlewares = [];

  // Registrazione dei middleware built-in in base alle opzioni
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
     * Registra un middleware generico nello stack.
     */
    use(fn) {
      middlewares.push(fn);
    },

    /**
     * Registra una rotta GET.
     */
    get(path, ...handler) {
      middlewares.push(route("GET", path, ...handler));
    },

    /**
     * Registra una rotta POST.
     */
    post(path, ...handler) {
      middlewares.push(route("POST", path, ...handler));
    },

    /**
     * Registra una rotta PUT.
     */
    put(path, ...handler) {
      middlewares.push(route("PUT", path, ...handler));
    },

    /**
     * Registra una rotta DELETE.
     */
    delete(path, ...handler) {
      middlewares.push(route("DELETE", path, ...handler));
    },

    /**
     * Registra una rotta PATCH.
     */
    patch(path, ...handler) {
      middlewares.push(route("PATCH", path, ...handler));
    },

    /**
     * Il delegato (req, res) da passare a http.createServer().
     */
    handler(req, res) {
      runMiddlewares(middlewares, req, res);
    },
  };

  return app;
}
