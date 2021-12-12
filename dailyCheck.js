const User=require("./Models/UserSchema");
const emailTransporter=require("./Middlewares/emailTransporter");
const QuestionSchema = require("./Models/QuestionSchema");

const sendDailyEmail= async () =>{
   try{
    let questions=await QuestionSchema.find().populate([{path:"answertoshow"},{path:"askedBy"}]);  
    let users=await User.find();  
    let currentDate=new Date().getDate();

    //let todayQuestions=questions.filter(q => new Date(q.createdAt).getDate() == currentDate);
     let weekQuestions=questions.filter(q => isThisWeek(new Date(q.createdAt)));
     
     for(let j=0; j<weekQuestions.length; j++){
         weekQuestions.sort((a,b) => { return b.createdAt - a.createdAt });
     }
    

   if(weekQuestions.length > 0){
    for(let i=0; i<users.length; i++){
        await emailTransporter.sendMail({
            from:"<justdoit-rw@justdoit-rw.tech>",
            to:users[i].email,
            subject:"JDI Trending Discussions Feed",
            html:`
              <div>
                <h3>Hello <strong>${users[i].userrname}</strong></h3>
                <p style="font-size: 18px;">Your collegues are busy discussing more about different topics.</p> 
                ${weekQuestions.map((weekQ,index) => `
                  ${index < 3 ? 
                    `
                    <div style="background-color: white;border-radius: 2px;margin-top: 3px;min-height: 80px;padding: 5px;">
                    <div style="display: flex; justify-content:flex-start; padding: 5px; align-items: center;">
                      <img src="${weekQ.askedBy.avatar}" style="width: 60px;height: 60px;border-radius: 50%;" alt="${weekQ.askedBy.username}" >
                      <h3><strong style="padding-left: 10px;">${weekQ.askedBy.username}</strong></h3>
                    </div>
                    <div>
                      <p style="font-size: 20px;">
                      <a href="https://www.justdoit-rw.tech"><strong>${weekQ.question}</strong></a></p>
                    </div>
                    <div>
                        ${weekQ.answertoshow 
                         ? 
                         `<p style="font-size: 22px;">${weekQ.answertoshow.answer}</p>
                         ${weekQ.answertoshow.images.length > 0 ? 
                         ` <img src="${weekQ.answertoshow.images[0]}"  height="350" width="580" style="display: block;margin-left: 5px;" alt="Answer picture" title="Image from JDI" >` : ``
                         }
                         ` 
                         : 
                         `` }
                    </div>
                 </div>
                  <hr>
                    ` : 
                    ""}  
                `)}
  
                <p style="background-color: dodgerblue; padding: 8px; border-radius: 5px; width: 25%;text-align: center;cursor:pointer;">
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

function isThisWeek (date) {
  const now = new Date();

  const weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
  const monthDay = now.getDate();
  const mondayThisWeek = monthDay - weekDay;

  const startOfThisWeek = new Date(+now);
  startOfThisWeek.setDate(mondayThisWeek);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfNextWeek = new Date(+startOfThisWeek);
  startOfNextWeek.setDate(mondayThisWeek + 7);

  return date >= startOfThisWeek && date < startOfNextWeek;
}

module.exports={sendDailyEmail};

