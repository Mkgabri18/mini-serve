export function runMiddlewares(middlewares, req, res) {
  function dispatch(i, err) {
    if (i >= middlewares.length) return;

    const middleware = middlewares[i];
    let called = false;

    function next(nextErr) {
      if (called) {
        console.error("next() called multiple times");
        return;
      }
      called = true;
      dispatch(i + 1, nextErr);
    }

    try {
      if (err) {
        // Stiamo gestendo un errore: invochiamo solo gli errori middleware (4 parametri)
        if (middleware.length === 4) {
          Promise.resolve(middleware(err, req, res, next)).catch(next);
        } else {
          // Salta il middleware normale e vai avanti trascinando l'errore
          dispatch(i + 1, err);
        }
      } else {
        // Funzionamento normale: invochiamo solo i middleware regolari (< 4 parametri)
        if (middleware.length < 4) {
          Promise.resolve(middleware(req, res, next)).catch(next);
        } else {
          // Salta l'error middleware
          dispatch(i + 1, err);
        }
      }
    } catch (caughtErr) {
      next(caughtErr);
    }
  }

  dispatch(0);
}
