const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags:  [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.parkSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0),
        location: Joi.string().required().escapeHTML(),
        // images: Joi.string().required,
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})