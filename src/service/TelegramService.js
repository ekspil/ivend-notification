
class TelegramService {

    constructor({knex, bot}){
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

        this.knex = knex
        this.bot = bot
        this.sendMsg = this.sendMsg.bind(this)

    }


    async sendMsg(chat, msg) {
        await this.bot.telegram.sendMessage(chat, msg)
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
