const Joi = require("joi");
/**
 * validator.js: contains all validation rules.
 */
module.exports = {
  /**
   * Function: validates the pagination paramters
   * here offset is set as optional
   * @param {*} value: pagination paramters namely - size and offset
   * @returns message stack
   */
  validatePaginationParameters: (value) => {
    const schema = Joi.object().keys({
      size: Joi.number().integer().required(),
      offset: Joi.number().integer().optional(),
    });
    return schema.validate(value);
  },
  /**
   * Todo object validator, check for fields limitations
   * @param {*} value: todo object
   * @returns message stack
   */
  todoValidator: (value) => {
    const schema = Joi.object().keys({
      id: Joi.number().integer().allow("").allow(null),
      title: Joi.string().required().min(1).max(100),
      completed: Joi.boolean().required(),
    });
    return schema.validate(value);
  },
};
