const HttpError = require("../utils/http");

function apiErrorHandler(err, req, res, next) {
    // in prod, don't use console.log or console.err because
    // it is not async
    console.error(err);

    if (err instanceof HttpError) {
        res.status(err.code).json({ message: err.message });
        return;
    }

    // If not HttpError, respond with 500
    res.status(500).json('INTERNAL SERVER ERROR');
}

module.exports = apiErrorHandler;