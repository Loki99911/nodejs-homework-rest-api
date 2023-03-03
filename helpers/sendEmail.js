const sgEmail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_MAIL } = process.env;

sgEmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = {
    ...data,
    // from: "",
    from: SENDGRID_MAIL,
  };
  await sgEmail.send(email);
  return true;
};

module.exports = sendEmail;