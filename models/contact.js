const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const phoneValidation = /^[\(]\d{3}[\)]\s\d{3}[\-]\d{4}$/;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    match: phoneValidation,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

contactSchema.post("save", mongooseHandleError);

const schemaJoi = Joi.object({
  name: Joi.string()
    .messages({ "any.required": "missing field - name" })
    .required(),
  email: Joi.string()
    .messages({ "any.required": "missing field - email" })
    .required(),
  phone: Joi.string()
    .messages({ "any.required": "missing field - phone" })
    .pattern(phoneValidation)
    .required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchemaJoi = Joi.object({
  favorite: Joi.boolean()
    .messages({ "any.required": "missing field - favorite" })
    .required(),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemaJoi, updateFavoriteSchemaJoi };
