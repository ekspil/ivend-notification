const fetch = require("node-fetch")
const MegafonAuthError = require("../errors/MegafonAuthError")
const MegafonUnknownError = require("../errors/MegafonUnknownError")

const SEND_SMS_URL = `https://a2p-api.megalabs.ru/sms/v1/sms`

class SmsService {


    async sendSms(recipent, text) {
        const body = JSON.stringify({
            from: "iVend",
            to: Number("7" + recipent),
            message: text
        })

        const response = await fetch(SEND_SMS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.MEGAFON_LOGIN}:${process.env.MEGAFON_PASSWORD}`).toString("base64")}`,
                "Content-Type": "application/json"
            },
            body
        })

        switch (response.status) {
            case 401:
            case 403:
                throw new MegafonAuthError()
            case 200:
                const json = await response.json()

                if (json && json.result && json.result.status && json.result.status.code === 0) {
                    return json
                }

                throw new MegafonUnknownError(response.status, json)
            default:
                throw new Error("Unknown response code from Megafon: " + response.status)
        }
    }

}

module.exports = SmsService
