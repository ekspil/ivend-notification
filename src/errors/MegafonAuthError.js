const logger = require("my-custom-logger")

class MegafonAuthError extends Error {

    constructor() {
        super()
        logger.error("Failed to auth request to Megafon")
        this.message = "Megafon authorization error"
    }

}

module.exports = MegafonAuthError
