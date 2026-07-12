// Operational error with an explicit HTTP status code. Thrown by controllers
// and services for expected failures (404, 409, 403, ...).
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
