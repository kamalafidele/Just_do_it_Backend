const nodeMailer = require("nodemailer");

const transport = nodeMailer.createTransport({
    service: 'Gmail',
    host: process.env.NET_CORE_SMTP,
    port: 465,
    secure: true,
    auth: {     
           user: process.env.SMTP_USERNAME,
           pass: process.env.SMTP_PASSWORD
    },
});


module.exports = transport;
