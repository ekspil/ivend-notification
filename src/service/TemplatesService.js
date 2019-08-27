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
            }
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
