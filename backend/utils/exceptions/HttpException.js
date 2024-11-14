export default class HttpException extends Error {
    constructor(statusCode, message = "An error occurred", data) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;

        // Maintain proper stack trace (only available in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
