const ServerStatusCodes = require("./ServerStatusCodes");

module.exports = {

    /**
     * Take a response object and build a (successful) HTTP response
     * @param Response res the nodejs Response object
     * @param SuccessResponse|ErrorResponse response
     */
    handleSuccessResponse(req, res, response) {
        res.status(response.statusCode).send(response);
    },

    /**
     * Take a response object and build a (unsuccessful) HTTP response
     * @param Response res the nodejs Response object
     * @param ErrorResponse error
     */
    handleErrorResponse(req, res, error, forceStatusCode = undefined) {
        let statusCode = 500;
        if (typeof (forceStatusCode) !== 'undefined') {
            statusCode = forceStatusCode;
        }
        res.status(statusCode).send(error);
    }

}