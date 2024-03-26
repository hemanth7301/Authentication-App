const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
require("dotenv").config();

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

const registerMail = async (req, res) => {
  const { userName, userEmail, text, subject } = req.body;

  var email = {
    body: {
      name: userName,
      intro: text,
      outro: "This is a test account. Do not reply on this mail.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: process.env.USER_EMAIL,
    to: userEmail,
    subject: subject,
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: "Email Sent" });
    })
    .catch((error) => res.status(500).send({ error }));
};

module.exports = { registerMail };
