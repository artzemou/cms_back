const Response = require('./Response');

/**
 * Class that will be used to return successful response
 */
class SuccessResponse extends Response {

    constructor(props) {
        super(props);
        this.success = true;
        this.payload = props.payload;
    }
}

module.exports = SuccessResponse;