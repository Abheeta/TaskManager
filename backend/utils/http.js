class HttpError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }

  // 4xx Client Error Codes
  static badRequest(msg) {
    return new HttpError(400, msg);
  }

  static unauthorized(msg) {
    return new HttpError(401, msg || 'Unauthorized');
  }

  static forbidden(msg) {
    return new HttpError(403, msg || 'Forbidden');
  }

  static notFound(msg) {
    return new HttpError(404, msg || 'Not Found');
  }

  static methodNotAllowed(msg) {
    return new HttpError(405, msg || 'Method Not Allowed');
  }

  static notAcceptable(msg) {
    return new HttpError(406, msg || 'Not Acceptable');
  }

  static requestTimeout(msg) {
    return new HttpError(408, msg || 'Request Timeout');
  }

  static conflict(msg) {
    return new HttpError(409, msg || 'Conflict');
  }

  static gone(msg) {
    return new HttpError(410, msg || 'Gone');
  }

  static tooManyRequests(msg) {
    return new HttpError(429, msg || 'Too Many Requests');
  }

  // 5xx Server Error Codes
  static internalServerError(msg) {
    return new HttpError(500, msg || 'Internal Server Error');
  }

  static notImplemented(msg) {
    return new HttpError(501, msg || 'Not Implemented');
  }

  static badGateway(msg) {
    return new HttpError(502, msg || 'Bad Gateway');
  }

  static serviceUnavailable(msg) {
    return new HttpError(503, msg || 'Service Unavailable');
  }

  static gatewayTimeout(msg) {
    return new HttpError(504, msg || 'Gateway Timeout');
  }

  static httpVersionNotSupported(msg) {
    return new HttpError(505, msg || 'HTTP Version Not Supported');
  }
}

module.exports = HttpError;