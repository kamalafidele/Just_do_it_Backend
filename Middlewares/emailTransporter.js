const nodeMailer=require("nodemailer");

const transport=nodeMailer.createTransport({
    host:process.env.MAIL_GUN_SMTP,
    port:587,
    auth:{     
           user:process.env.MAIL_GUN_USER,
           pass:process.env.MAIL_GUN_PASS
    }
});


module.exports=transport;
