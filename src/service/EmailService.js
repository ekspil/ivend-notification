const nodemailer = require("nodemailer")
const logger = require("my-custom-logger")

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            secure: true,
            tls: {rejectUnauthorized: false},
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER, // generated ethereal user
                pass: process.env.SMTP_PASS, // generated ethereal password
            }
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
        logger.debug(`Sending ${subject} to ${recipent} : ${JSON.stringify(info)}`)
    }

}

module.exports = EmailService
