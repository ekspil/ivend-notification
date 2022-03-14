const validation = require("./validation")
const {validateSendEmailRequest} = validation

function validatePhoneNumber(phone) {
    return typeof phone === "string" &&  new RegExp(/^[3,7,9](\d){8,12}$/).test(phone)
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
