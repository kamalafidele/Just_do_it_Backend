const User=require("./Models/UserSchema");
const emailTransporter=require("./Middlewares/emailTransporter");
const QuestionSchema = require("./Models/QuestionSchema");

const sendDailyEmail= async () =>{
   try{
    let questions=await QuestionSchema.find().populate([{path:"answertoshow"},{path:"askedBy"}]);  
    let users=await User.find();  
    let currentDate=new Date().getDate();

    let todayQuestions=questions.filter(q => new Date(q.createdAt).getDate() == currentDate);

 
   if(todayQuestions.length > 0){
    for(let i=0; i<users.length; i++){
        await emailTransporter.sendMail({
            from:"<justdoit-rw@justdoit-rw.tech>",
            to:users[i].email,
            subject:"JDI Trending Discussions Feed",
            html:`
              <div>
                <h3>Hello <strong>${users[i].username}</strong></h3>
                <p style="font-size: 18px;">Your collegues are busy discussing more about different topics.</p> 
                <div style="background-color: white;border-radius: 2px;margin-top: 3px;min-height: 80px;padding: 5px;">
                   <div style="display: flex; justify-content:flex-start; padding: 5px; align-items: center;">
                     <img src="${todayQuestions[0].askedBy.avatar}" style="width: 60px;height: 60px;border-radius: 50%;" alt="${todayQuestions[0].askedBy.username}" >
                     <h3><strong style="padding-left: 10px;">${todayQuestions[0].askedBy.username}</strong></h3>
                   </div>
                   <div>
                     <p style="font-size: 20px;">
                     <a href="https://www.justdoit-rw.tech"><strong>${todayQuestions[0].question}</strong></a></p>
                   </div>
                   <div>
                       ${todayQuestions[0].answertoshow 
                        ? 
                        `<p style="font-size: 22px;">${todayQuestions[0].answertoshow.answer}</p>
                        ${todayQuestions[0].answertoshow.images.length > 0 ? 
                        ` <img src="${todayQuestions[0].answertoshow.images}" style="width: 70%;height: 350px;margin-left: 5px;" alt="answer-pic" >` : ``
                        }
                        ` 
                        : 
                        `` }
                   </div>
                </div>  
                <p style="background-color: dodgerblue; padding: 8px; border-radius: 5px; width: 35%;text-align: center;cursor:pointer;">
                <a style="text-decoration: none; color:white;" href="https://www.justdoit-rw.tech">Check more interesting discussions</a></p>
                <p style="padding: 6px; text-align: center; color: white; background: dodgerblue;margin-top:25px;">
                Copyright © 2021 - JustDoIt. All Rights and Policies Reserved</p>
             </div>           
              `
        });
        console.log(`Email ${i} sent.....`);
    } 

   }
   }catch(err){
       console.log("Error while retrieving and sending emails all users",err);
   }
}

const sendWeeklyEmail = async () =>{

   try{

    let users=await User.find();  
    
    for(let i=0; i<users.length; i++){
        await emailTransporter.sendMail({
            from:"<justdoit-rw@justdoit-rw.tech>",
            to:users[i].email,
            subject:"JDI Wishes Happy Weekend",
            html:`
              <div>
    
                <p style="background-color: dodgerblue; padding: 8px; border-radius: 5px; width: 35%;text-align: center;cursor:pointer;">
                <a style="text-decoration: none; color:white;" href="https://www.justdoit-rw.tech">Check more interesting discussions</a></p>
                <p style="padding: 6px; text-align: center; color: white; background: dodgerblue;margin-top:25px;">
                Copyright © 2021 - JustDoIt. All Rights and Policies Reserved</p>
             </div>           
              `
        });
        console.log(`Email ${i} sent.....`);
    } 

   }catch(err){
       console.log("Error while retrieving and sending emails all users",err);
   }
}

module.exports={sendDailyEmail,sendWeeklyEmail};