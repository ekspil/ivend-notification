require("dotenv").config()

// if (!process.env.MEGAFON_LOGIN || !process.env.MEGAFON_PASSWORD) {
//     throw new Error("MEGAFON_LOGIN or MEGAFON_PASS env is not set")
// }

const EmailService = require("./service/EmailService")
const SmsService = require("./service/SmsService")
const TelegramService = require("./service/TelegramService")
const TemplatesService = require("./service/TemplatesService")
const Telegraf = require("telegraf")

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        ssl: true
    }
})

const Routes = require("./routes")
const logger = require("my-custom-logger")

const fastify = require("fastify")({
})

const smsService = new SmsService({})
const emailService = new EmailService({})
const templatesService = new TemplatesService({})
const telegramService = new TelegramService({knex, bot})

Routes({fastify, emailService, smsService, templatesService, telegramService})

fastify.register(require("fastify-healthcheck"))

fastify.listen(4500, "0.0.0.0", (err) => {
    logger.info("Ivend notification service started on port 4500")
    if (err) throw err
})


