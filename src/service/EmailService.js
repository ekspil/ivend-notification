const nodemailer = require("nodemailer")

class EmailService {


    constructor() {
        this.emailTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false
        })

        this.sendEmail = this.sendEmail.bind(this)
    }

    async sendEmail(recipent, subject, text) {

        const mailOptions = {
            from: "ivend.notifier@gmail.com", // sender address
            to: recipent,
            subject: subject,
            html: `<p>${text}</p>`
        }

        return await this.emailTransport.sendMail(mailOptions)

    }

}

module.exports = EmailService
