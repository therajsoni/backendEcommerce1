class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor); // this means all error and this.constructor means not add his error constructor message
  }
}
module.exports = ErrorHandler;
// node ki default class hai Error
