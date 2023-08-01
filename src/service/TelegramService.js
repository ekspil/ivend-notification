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

            await ctx.reply(this.texts(6, ctx))

            //await this.sendGQLRequest(ctx)
        })
        bot.help((ctx) => ctx.reply(this.texts(4, ctx)))

        bot.on("message", async (ctx) => {
            await this.sendGQLRequest(ctx)

        })
        
        
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
                hash: ctx.update.message.text,
                telegramChat: String(ctx.update.message.chat.id),
            }
        }

        try{

            const notification = await client.request(query, variables)
            if(!notification.insertTelegramToNotificationSetting){
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
Вероятно вы совершили ошибку в написании уникального кода :(
                
Дополнительная справка /help
                `
            case 2:
                return `
IVEND:
Система нотификации подключена!
Для получения нотификации по событиям, отметьте соответсвующие события галочками.
                            
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

Для получения нотификации по событиям, напишите в этот чат персоныльный код, который находится в настройках уведомлений в личном кабинете. 

Обращаем внимание, что вводить код необходимо с учетом регистра(большие и маленькие буквы вводятся так как написано), а так же со всеми символами, включая знаки '=' на конце.
            
        `
            case 6:
                return `
IVEND:
Добро пожаловать в систему нотификации IVEND!
Для подключения, введите персональный код, который находится в настройках уведомлений личного кабинета.
                            
Дополнительная справка /help`
            default:
                return ``
        }

    }

}

module.exports = TelegramService
