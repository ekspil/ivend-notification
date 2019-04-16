class ValidationError extends Error {

    constructor() {
        super()
        this.message = "Request body contains malformed request"
    }

}

module.exports = ValidationError
