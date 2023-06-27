const {GraphQLClient} = require("graphql-request")
const client = new GraphQLClient(process.env.GRAPHQL_API_URL, {
    headers: {
        Authorization: process.env.AUTH_HEADER_STRING
    }
})

class TelegramService {

    constructor({bot, logger}){


        this.sendMsg = this.sendMsg.bind(this)
        this.texts = this.texts.bind(this)
        this.sendGQLRequest = this.sendGQLRequest.bind(this)
        this.bot = bot

        bot.start(async (ctx) => {
            await this.sendGQLRequest(ctx)
        })
        bot.help((ctx) => ctx.reply(this.texts(4, ctx)))
        bot.launch()
            .then(()=>{
                logger.info(`telegram_service_success service_started`)
            })
            .catch(err => {
                logger.info(`telegram_service_error ${err.message}`)
            })


    }


    async sendMsg(chat, msg) {

        const json ={
            result: {
                status: {
                    code: 0
                }
            }
        }

        try{
            await this.bot.telegram.sendMessage(chat, msg)
            return JSON.stringify(json)
        }
        catch (e) {
            throw new Error("ERROR_DURING_SENDING_TLGRM")
        }

    }
    async sendGQLRequest(ctx){
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
                await ctx.reply(this.texts(1, ctx))
            }else {
                await ctx.reply(this.texts(2, ctx))
            }
        }
        catch(e){
            await ctx.reply(this.texts(3, ctx))
        }

    }

    texts(type, ctx){
        switch (type) {
            case 1:
                return `
                
IVEND:
Система нотификации НЕ подключена!
Ваш логин: ${ctx.update.message.chat.username}
Сперва введите логин в соответсвующие поля в личном кабинете.
                
Дополнительная справка /help
                `
            case 2:
                return `
IVEND:
Система нотификации подключена!
Ваш логин: ${ctx.update.message.chat.username}
Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете.
                            
Дополнительная справка /help
                `
            case 3:
                return `
                
IVEND:
Ошибка работы бота! Бот потерял связь с главным сервером IVEND!
Сообщите об ошибке администратору системы!

                `
            case 4:
                return `
IVEND HELP:
Ваш логин: ${ctx.update.message.chat.username}
Идентификатор чата: ${ctx.update.message.chat.id}
Для получения нотификации по событиям, введите логин в соответсвующие поля в личном кабинете. 
Если логина нет, его необходимо создать в натсройках профиля.
            
Различные события можно отправлять на различные Телеграм аккануты, для этого за каждым событием можно закрепить отдельный логин.
            
Чтобы аккаунт получал уведомления, необходимо именно с этого аккаунта найти этот бот @ivend_bot и ввести /start
        `
            default:
                return ``
        }

    }

}

module.exports = TelegramService
