const logger = require("../utils/logger")

class MegafonAuthError extends Error {

    constructor() {
        super()
        logger.error("Failed to auth request to Megafon")
        this.message = "Megafon authorization error"
    }

}

module.exports = MegafonAuthError
