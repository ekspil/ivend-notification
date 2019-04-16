const Joi = require("joi")

const sendEmailRequestSchema = Joi.object().keys({
    templateType: Joi.string().min(3).max(30).required(),
    recipent: Joi.string().min(3).max(30).required(),
    text: Joi.string().alphanum().min(3).max(30).required(),
}).with("username", "birthyear")

const ValidationError = require("../errors/ValidationError")

const validateSendEmailRequest = async (data) => {
    const result = Joi.validate(data, sendEmailRequestSchema)

    if(result.error) {
        throw new ValidationError()
    }

    return true
}


module.exports = {
    validateSendEmailRequest
}
