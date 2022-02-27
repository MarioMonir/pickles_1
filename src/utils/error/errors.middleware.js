import createHttpError from "http-errors";

// ------------------------------------------------------------------

const catchNotFound = (_, __, next) => next(createHttpError(404));

// ------------------------------------------------------------------

const errorHandler = (err, req, res, _) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ error: err });
};

// ------------------------------------------------------------------

export default { catchNotFound, errorHandler };
