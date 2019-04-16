const logger = require("../utils/logger")

class MegafonUnknownError extends Error {

    constructor(statusCode, json) {
        super()
        logger.error(`[${statusCode}]: ${JSON.stringify(json)}`)
        this.message = "Unknown error from Megafon"
    }

}

module.exports = MegafonUnknownError
