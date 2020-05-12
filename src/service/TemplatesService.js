const TemplateType = require("../enum/TemplateType")
const TemplateNotFound = require("../errors/TemplateNotFound")
const ValidationError = require("../errors/ValidationError")
const logger = require("my-custom-logger")

class TemplatesService {
    constructor() {
        this.templates = {
            "REGISTRATION_SMS": {
                id: "REGISTRATION_SMS",
                type: TemplateType.SMS,
                replacements: ["code"],
                render: (replacements) => `Проверочный код: ${replacements.code}`
            },
            "TELEGRAM_MSG": {
                id: "TELEGRAM_MSG",
                type: TemplateType.TELEGRAM,
                replacements: ["msg"],
                render: (replacements) => `IVEND NOTIFICATION: ${replacements.msg}`
            },
            "EMAIL_MSG": {
                id: "EMAIL_MSG",
                type: TemplateType.EMAIL,
                replacements: ["msg"],
                render: (replacements) => `<div>IVEND NOTIFICATION: ${replacements.msg}</div> `
            },
            "REGISTRATION_EMAIL": {
                id: "REGISTRATION_EMAIL",
                type: TemplateType.EMAIL,
                subject: `Благодарим за регистрацию`,
                replacements: ["token"],
                render: (replacements) => `<div><a href="${process.env.FRONTEND_URL}/confirm?token=${replacements.token}&action_type=CONFIRM_EMAIL">Пройдите по ссылке чтобы подтвердить учётную запись</a></div>`
            },
            "CHANGE_EMAIL": {
                id: "CHANGE_EMAIL",
                type: TemplateType.EMAIL,
                subject: `Смена email`,
                replacements: ["token"],
                render: (replacements) => `<div><a href="${process.env.FRONTEND_URL}/confirm?token=${replacements.token}&action_type=EDIT_EMAIL_CONFIRM">Пройдите по ссылке чтобы подтвердить смену email</a></div>`
            },
            "CHANGE_PASSWORD": {
                id: "CHANGE_PASSWORD",
                type: TemplateType.EMAIL,
                subject: `Смена пароля`,
                replacements: ["token"],
                render: (replacements) => `<div><a href="${process.env.FRONTEND_URL}/confirm?token=${replacements.token}&action_type=EDIT_PASSWORD_CONFIRM">Пройдите по ссылке чтобы подтвердить смену пароля</a></div>`
            },
            "REMEMBER_PASSWORD": {
                id: "REMEMBER_PASSWORD",
                type: TemplateType.EMAIL,
                subject: `Восстановление пароля`,
                replacements: ["token"],
                render: (replacements) => `<div><a href="${process.env.FRONTEND_URL}/NewPassword?token=${replacements.token}">Пройдите по ссылке чтобы указать новый пароль</a></div>`
            },
            "SEND_EMAIL": {
                id: "SEND_EMAIL",
                type: TemplateType.EMAIL,
                subject: `Вопрос в техподдержку`,
                replacements: ["input", "user", "legalInfo"],
                render: (replacements) => `<div><h2>${replacements.input.title}</h2><h3>Обращение от ${replacements.legalInfo.companyName}</h3><p>${replacements.input.text}</p><p><a href="mailto:${replacements.user.email}">Ответить пользователю на ${replacements.user.email}</a></p></div>`
            },
        }

        this.getTemplateById = this.getTemplateById.bind(this)
        this.renderTemplate = this.renderTemplate.bind(this)

    }

    async getTemplateById(templateId) {
        return this.templates[templateId] || null
    }

    async renderTemplate(templateId, data) {
        const template = await this.getTemplateById(templateId)

        if (!template) {
            throw new TemplateNotFound()
        }

        logger.debug(`render_template ${templateId} ${data}`)

        if (!template.replacements.every(replacement => Object.keys(data).indexOf(replacement) !== -1)) {
            throw new ValidationError()
        }

        return template.render(data)
    }

}

module.exports = TemplatesService
