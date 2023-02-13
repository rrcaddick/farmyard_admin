const nodemailer = require("nodemailer");
const sendinBlue = require("nodemailer-sendinblue");

const createMailerTransporter = () => {
  return nodemailer.createTransport(
    sendinBlue({
      apiKey: process.env.SEND_IN_BLUE_API_KEY,
      apiUrl: "https://api.sendinblue.com/v3/smtp",
    })
  );
};

module.exports = {
  createMailerTransporter,
};
