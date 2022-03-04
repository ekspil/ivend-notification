const {GraphQLClient} = require("graphql-request")
const client = new GraphQLClient(process.env.GRAPHQL_API_URL, {
    headers: {
        Authorization: process.env.AUTH_HEADER_STRING
    }
})

class TelegramService {

    constructor({bot, logger}){
        bot.start(async (ctx) => {
            const query = `
        mutation($input: NotificationSettingTelegramChat!) {
          insertTelegramToNotificationSetting(input: $input) 
        }
        `

            const variables = {
                input: {
                    telegram: ctx.update.message.chat.username,
                    telegramChat: String(ctx.update.message.chat.id),
                }
            }
            
            try{

                const notification = await client.request(query, variables)
                if(!notification){
                    await ctx.reply(`
                
IVEND:
Система нотификации НЕ подключена!
Ваш логин: ${ctx.update.message.chat.username}
Сперва введите логин в соответсвующие поля в личном кабинете.
                
Дополнительная справка /help
                `)
                }else {
                    await ctx.reply(`
IVEND:
Система нотификации подключена!
Ваш логин: ${ctx.update.message.chat.username}
Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете.
                            
Дополнительная справка /help
                `)
                }     
            }
            catch(e){
                await ctx.reply(`
                
IVEND:
Ошибка работы бота! Бот потерял связь с главным сервером IVEND!
Сообщите об ошибке администратору системы!

                `)
            }


        })
        bot.help((ctx) => ctx.reply(`
IVEND HELP:
Ваш логин: ${ctx.update.message.chat.username}
Идентификатор чата: ${ctx.update.message.chat.id}
Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете. 
Если логина нет, его необходимо создать в натсройках профиля.
            
Различные события можно отправлять на различные Телеграм аккануты, для этого за каждым событием можно закрепить отдельный логин.
            
Чтобы аккаунт получал уведомления, необходимо именно с этого аккаунта найти этот бот @ivend_bot и ввести /start
        `))

        bot.launch()
            .then(()=>{

                this.bot = bot
                this.sendMsg = this.sendMsg.bind(this)
                logger.info(`telegram_service_success servise started`)
            })
            .catch(err => {
                logger.info(`telegram_service_error ${err.message}`)
            })


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
