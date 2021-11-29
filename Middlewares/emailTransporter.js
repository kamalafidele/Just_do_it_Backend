const nodeMailer=require("nodemailer");
//5291de1fec9d00d1dd8ba02ecec68fab-7b8c9ba8-d9d70703
//Password for justdoit-rw user 5291de1fec9d00d1dd8ba02ecec68fab-7b8c9ba8-d9d70703;
//Password for postmaster is cba84d5677712e83e4f0312cf128ece6-7b8c9ba8-c33e97b2
const transport=nodeMailer.createTransport({
    host:"smtp.mailgun.org",
    port:587,
    auth:{     
           user:"justdoit-rw@justdoit-rw.tech ",
           pass:"5291de1fec9d00d1dd8ba02ecec68fab-7b8c9ba8-d9d70703"
    }
});


module.exports=transport;
