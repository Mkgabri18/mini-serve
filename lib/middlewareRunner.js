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
        // We are handling an error: invoke error-handling middlewares only (4 arguments)
        if (middleware.length === 4) {
          Promise.resolve(middleware(err, req, res, next)).catch(next);
        } else {
          // Skip normal middleware and continue passing down the error
          dispatch(i + 1, err);
        }
      } else {
        // Normal flow: invoke regular middlewares only (< 4 arguments)
        if (middleware.length < 4) {
          Promise.resolve(middleware(req, res, next)).catch(next);
        } else {
          // Skip error-handling middleware
          dispatch(i + 1, err);
        }
      }
    } catch (caughtErr) {
      next(caughtErr);
    }
  }

  dispatch(0);
}
