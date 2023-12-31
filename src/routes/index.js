const validationUtils = require("../utils/validationUtils")
const logger = require("my-custom-logger")
const ValidationError = require("../errors/ValidationError")
const TemplateType = require("../enum/TemplateType")
const TemplateNotFound = require("../errors/TemplateNotFound")
const MegafonAuthError = require("../errors/MegafonAuthError")

function Routes({fastify, smsService, emailService, templatesService, telegramService}) {

    const sendTemplate = async (request, reply) => {
        const {templateId} = request.params

        const template = await templatesService.getTemplateById(templateId)

        if (!template) {
            throw new TemplateNotFound()
        }

        const content = await templatesService.renderTemplate(templateId, request.body)

        if (template.type === TemplateType.SMS) {
            const {phone} = request.body

            if (!validationUtils.validatePhoneNumber(phone)) {
                throw new ValidationError()
            }

            await smsService.sendSms(phone, content)

            return reply.type("application/json").code(200).send({sent: true})
        }

        if (template.type === TemplateType.TELEGRAM) {
            const {chat} = request.body

            await telegramService.sendMsg(chat, content)

            return reply.type("application/json").code(200).send({sent: true})
        }

        if (template.type === TemplateType.EMAIL) {
            const {email, input} = request.body
            let {subject} = template

            if (!validationUtils.validateEmail(email)) {
                throw new ValidationError()
            }

            if(input && input.title && input.category) subject = "IVEND TP: " + input.category.toUpperCase() + " // " + input.title

            await emailService.sendEmail(email, subject, content)

            return reply.type("application/json").code(200).send({sent: true})
        }

        throw new Error("Unknown template type")
    }


    fastify.setErrorHandler((error, request, reply) => {
        if (error instanceof ValidationError) {
            logger.warning(`ValidationError. RequestBody: ${JSON.stringify(request.body)}`)
            return reply.type("application/json").code(400).send()
        }

        if (error instanceof TemplateNotFound) {
            logger.warning(`Template not found`)
            return reply.type("application/json").code(404).send({sent: false})
        }

        if (error instanceof MegafonAuthError) {
            logger.warning(`MegafonAuthError. RequestBody: ${JSON.stringify(request.body)}`)
            return reply.type("application/json").code(503).send({sent: false})
        }

        logger.error(error)
        logger.error(`RequestBody: ${JSON.stringify(request.body)}`)
        logger.error(error.stack)
        reply.type("application/json").code(500).send({sent: false})
    })

    fastify.post("/api/v1/template/:templateId", sendTemplate)

}

module.exports = Routes
