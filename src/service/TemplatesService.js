const TemplateType = require("../enum/TemplateType")
const TemplateNotFound = require("../errors/TemplateNotFound")
const ValidationError = require("../errors/ValidationError")

class TemplatesService {
    constructor() {
        this.templates = {
            1: {
                type: TemplateType.SMS,
                replacements: ["code"],
                render: (replacements) => `Проверочный код: ${replacements.code}`
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

        if (!template.replacements.every(replacement => Object.keys(data).indexOf(replacement) !== -1)) {
            throw new ValidationError()
        }

        return template.render(data)
    }

}

module.exports = TemplatesService
