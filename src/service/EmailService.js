const nodemailer = require("nodemailer")
const logger = require("../utils/logger")

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
        const info = await this.transporter.sendMail({
            from: `iVend <root@ivend.pro>`, // sender address
            to: recipent, // list of receivers
            subject, // Subject line
            html
        })


        logger.info(info)
    }

}

module.exports = EmailService
