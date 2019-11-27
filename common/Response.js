/**
 * Class that will be the parent for SuccessResponse and ErrorResponse
 */
class Response {

    constructor(props) {
        // Just an easy check for the success/failure of the response
        this.success = false;
        this.message = props.message ? props.message : null;
        // HTTP code
        this.statusCode = props.statusCode;
    }

    isSuccess() {
        return this.success;
    }

    setStatusCode(code) {
        this.statusCode = code;
    }

    getStatusCode() {
        return this.statusCode;
    }
}

module.exports = Response;