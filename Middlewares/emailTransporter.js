const nodeMailer=require("nodemailer");

const transport=nodeMailer.createTransport({
    host:process.env.NET_CORE_SMTP,
    port:587,
    auth:{     
           user:process.env.NET_CORE_USER,
           pass:process.env.NET_CORE_PASS
    }
});


module.exports=transport;
