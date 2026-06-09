import { route } from "./router.js";
import { runMiddlewares } from "./middlewareRunner.js";

/**
 * Factory che crea l'istanza dell'applicazione.
 * Gestisce lo stack di middleware e offre un'API builder
 * compatibile con la sintassi usata in app.js.
 */
export function createServer() {
  const middlewares = [];

  const app = {
    /**
     * Registra un middleware generico nello stack.
     * Supporta sia middleware normali (req, res, next)
     * che error middleware (err, req, res, next).
     */
    use(fn) {
      middlewares.push(fn);
    },

    /**
     * Scorciatoie per registrare rotte HTTP.
     * Ogni metodo wrappa il handler dentro route()
     * che lo trasforma in un middleware con matching di path e parametri.
     */
    get(path, ...handler) {
      middlewares.push(route("GET", path, ...handler));
    },

    post(path, ...handler) {
      middlewares.push(route("POST", path, ...handler));
    },

    put(path, ...handler) {
      middlewares.push(route("PUT", path, ...handler));
    },

    delete(path, ...handler) {
      middlewares.push(route("DELETE", path, ...handler));
    },

    patch(path, ...handler) {
      middlewares.push(route("PATCH", path, ...handler));
    },

    /**
     * Il delegato (req, res) da passare a http.createServer().
     * Avvia la catena di middleware per ogni richiesta in arrivo.
     */
    handler(req, res) {
      runMiddlewares(middlewares, req, res);
    },
  };

  return app;
}
