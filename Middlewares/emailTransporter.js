const nodeMailer=require("nodemailer");

const transport=nodeMailer.createTransport({
    service:"Gmail",
    host:"smtp.gmail.com",
    port:456,
    secure:true,
    auth:{     
           user:"justdoitrw2@gmail.com",
           pass:"//JUSTDOIT250"
    }
});


module.exports=transport;
