const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseHandleError);

const signupSchemaJoi = Joi.object({
  password: Joi.string()
    .messages({ "any.required": "missing field - password" })
    .required(),
  email: Joi.string()
    .messages({ "any.required": "missing field - email" })
    .required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
});

const loginSchemaJoi = Joi.object({
  password: Joi.string()
    .messages({ "any.required": "missing field - password" })
    .required(),
  email: Joi.string()
    .messages({ "any.required": "missing field - email" })
    .required(),
});

const subscriptionSchemaJoi = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  signupSchemaJoi,
  loginSchemaJoi,
  subscriptionSchemaJoi,
};
