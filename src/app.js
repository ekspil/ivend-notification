require("dotenv").config()

// if (!process.env.MEGAFON_LOGIN || !process.env.MEGAFON_PASSWORD) {
//     throw new Error("MEGAFON_LOGIN or MEGAFON_PASS env is not set")
// }

const EmailService = require("./service/EmailService")
const SmsService = require("./service/SmsService")
const TelegramService = require("./service/TelegramService")
const TemplatesService = require("./service/TemplatesService")

const Routes = require("./routes")
const logger = require("my-custom-logger")

const fastify = require("fastify")({
})

const smsService = new SmsService({})
const emailService = new EmailService({})
const templatesService = new TemplatesService({})
const telegramService = new TelegramService({})

Routes({fastify, emailService, smsService, templatesService, telegramService})

fastify.register(require("fastify-healthcheck"))

fastify.listen(4500, "0.0.0.0", (err) => {
    logger.info("Ivend notification service started on port 4500")
    if (err) throw err
})


