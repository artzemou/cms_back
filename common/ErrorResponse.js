const Response = require('./Response');

/**
 * Class that will be used to return unsuccessful response
 */
class ErrorResponse extends Response {

    constructor(props) {
        super(props);
        this.code = props.code;
    }
}

module.exports = ErrorResponse;