const validation = require("./validation")
const {validateSendEmailRequest} = validation

function validatePhoneNumber(phone) {
    return typeof phone === "string" && new RegExp(/^9(\d){9,9}$/).test(phone)
}

function validateEmail(email) {
    return typeof email === "string" && email.length > 0
}

function validateSubject(subject) {
    return typeof subject === "string" && subject.length > 0
}


module.exports = {
    validatePhoneNumber,
    validateSendEmailRequest,
    validateEmail,
    validateSubject
}
