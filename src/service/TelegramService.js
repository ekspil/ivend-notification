
const Telegraf = require("telegraf")
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "ivendgit",
        ssl: false
    }
})


const bot = new Telegraf(process.env.TELEGRAM_TOKEN || "925170330:AAHFN9v4SpAPAzwGGEdBlk_yGdQDlL4znok")
bot.start(async (ctx) => {

    const [notification] = await knex("notification_settings")
        .select("id", "type", "email", "sms", "telegram", "telegramChat")
        .where({
            telegram: ctx.update.message.chat.username
        })
    if(!notification){
        ctx.reply(`
        IVEND:
        Система нотификации НЕ подключена!
        Ваш логин: ${ctx.update.message.chat.username}
        Сперва введите логин в соответсвующие поля в личном кабинете.
        
        Дополнительная справка /help
        `)
    }else {
        await knex("notification_settings")
            .update({
                telegramChat: ctx.update.message.chat.id,
                updated_at: new Date()
            })
            .where({
                telegram: ctx.update.message.chat.username
            })
        ctx.reply(`
        IVEND:
        Система нотификации подключена!
        Ваш логин: ${ctx.update.message.chat.username}
        Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете.
        
        Дополнительная справка /help
        `)
    }

})
bot.help((ctx) => ctx.reply(`
IVEND HELP:
Ваш логин: ${ctx.update.message.chat.username}
Идентификатор чата: ${ctx.update.message.chat.id}
Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете.

Различные события можно отправлять на различные Телеграм аккануты, для этого за каждым событием можно закрепить отдельный логин.

Чтобы аккаунт получал уведомления, необходимо именно с этого аккаунта найти этот бот @ivend_bot и ввести /start
`))

bot.launch()


class TelegramService {


    async sendMsg(chat, msg) {
        await bot.telegram.sendMessage(chat, msg)
        const json ={
            result: {
                status: {
                    code: 0
                }
            }
        }
        return JSON.stringify(json)
    }

}

module.exports = TelegramService
