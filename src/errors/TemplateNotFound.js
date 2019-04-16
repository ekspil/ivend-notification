class TemplateNotFound extends Error {

    constructor() {
        super()
        this.message = "Template not found"
    }

}

module.exports = TemplateNotFound
