const nodemailer = require("nodemailer")
const logger = require("my-custom-logger")

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            secure: false,
            tls: {rejectUnauthorized: false},
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
        })

        this.sendEmail = this.sendEmail.bind(this)
    }

    async sendEmail(recipent, subject, html) {
        logger.info(`Sending ${subject} to ${recipent}`)
        const info = await this.transporter.sendMail({
            from: `iVend <no-reply@ivend.pro>`, // sender address
            to: recipent, // list of receivers
            subject, // Subject line
            html
        })


        logger.debug("send_mail_info: " + info)
    }

}

module.exports = EmailService
