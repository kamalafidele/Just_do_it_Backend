const User=require("./Models/UserSchema");
const emailTransporter=require("./Middlewares/emailTransporter");
const QuestionSchema = require("./Models/QuestionSchema");

const sendWeeklyEmail= async () =>{
   try{
    let questions=await QuestionSchema.find().populate([{path:"answertoshow"},{path:"askedBy"}]);  
    let users=await User.find();  
    //let currentDate=new Date().getDate();

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
            subject:weekQuestions[0].question,
            html:`
              <div>
                <h1 style="text-align: center;">JDI Trending Discussions Feed</h1>
                <h3>Hello <strong>${users[i].username}</strong></h3>
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
                      <a href="https://www.justdoit-rw.tech"><strong>${weekQ.question }</strong></a></p>
                    </div>
                    <div>
                        ${weekQ.answertoshow 
                         ? 
                         `<p style="font-size: 22px;">${weekQ.answertoshow.answer.length > 150 ? weekQ.answertoshow.answer.substring(0,150)+"..."+`<a href="https://www.justdoit-rw.tech/questionAnswers/${weekQ._id}" style='text-decoration:none;'>Read More</a>` : weekQ.answertoshow.answer } </p>
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

const happyWeekEmail = async () =>{
  try{
    let users=await User.find();  

    for(let i=0; i<users.length; i++){
        await emailTransporter.sendMail({
            from:"<justdoit-rw@justdoit-rw.tech>",
            to:users[i].email,
            subject:"JDI Happy Weekend ",
            html:`
              <div>
                <h3>Hello <strong style="color: dodgerblue"> <em>${users[i].username}</em></strong></h3>
                <p style="font-size: 18px;">JustDoIt wishes you a Happy and Nice Weekend.</p> 
                <div>
                  <div style="display: flex; justify-content: space-between; flex-direction: row;">
                    <img src="https://res.cloudinary.com/justdoit/image/upload/v1639309450/questionImages/images/Week1_iccksj.jpg" alt="weekend picture 1" height="350" style="width: 48%;border-radius: 4px;">
                    <img src="https://res.cloudinary.com/justdoit/image/upload/v1639470959/questionImages/images/Kevin-Gone-Fishing_txetcm.gif" alt="weekend picture 2" height="350" style="width: 48%; border-radius: 4px; margin-left: 10px;">
                  </div>
                  <div style="padding-top: 15px;">
                     <img src="https://res.cloudinary.com/justdoit/image/upload/v1639470957/questionImages/images/Quote1_fzof7a.jpg" alt="weekend picture 3" height="400" style="width: 97%; border-radius: 5px;">
                  </div>
                </div>
                <p style="background-color: dodgerblue; padding: 8px; border-radius: 5px; width: 25%;text-align: center;cursor:pointer;">
                <a style="text-decoration: none; color:white;" href="https://www.justdoit-rw.tech">Enjoy with JDI</a></p>
                <p style="padding: 6px; text-align: center; color: white; background: dodgerblue;margin-top:25px;">
                Copyright © 2021 - JustDoIt. All Rights and Policies Reserved</p>
             </div>           
              `
        });
        console.log(`Happy Week Email ${i} sent.....`);
    } 
  }catch(err){
    console.log("SENDING HAPPY WEEK EMAIL FAILED: ",err);
  }
}

module.exports={sendWeeklyEmail,happyWeekEmail};

