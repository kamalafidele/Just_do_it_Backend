//  THIRD PARTY PACKAGES 
const express=require("express");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cronJob=require("cron").CronJob;

// ROUTES 
const userRoutes=require("./Routes/userRoutes");
const workspaceRoutes=require("./Routes/workspaceRoute");
const questionsRoute=require("./Routes/questionsRoute");
const answerRoute=require("./Routes/answerRoutes");
const filesRoute=require("./Routes/fileRoutes");
const notificationRoute=require("./Routes/notificationRoute");
const addsRoute=require("./Routes/addRoutes");
const commentRoutes=require("./Routes/commentRoutes");

//  MIDDLEWARES
const {sendWeeklyEmail,happyWeekEmail, sendNotifications}=require("./dailyCheck");
const tokenChecker=require("./Middlewares/tokenAuth");
dotenv.config();

//Database connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then( _=>{
    console.log("APP CONNECTED ON DB");
}).catch(err =>{console.log("Connecting to db errors: ",err)});



//Middlewares
let log=console.log;
const logger=(req,res,next) =>{
    log(req.url+" "+req.method);
    next();
}

var corsOptions = {
    origin: ['https://justdoit-rw.tech','http://localhost:4200'],
    optionsSuccessStatus: 200 
  }

app.use(express.json({limit:'15mb'}));
app.use(express.urlencoded({limit:'10mb',extended:true}));
app.use(cors(corsOptions));

app.use(logger);
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
  });

//Routes
app.use("/api/justdoit/users",userRoutes);
app.use("/api/justdoit/workspaces",tokenChecker,workspaceRoutes);
app.use("/api/justdoit/questions",tokenChecker,questionsRoute);
app.use("/api/justdoit/answers",tokenChecker,answerRoute);
app.use("/api/justdoit/userFiles",tokenChecker,filesRoute);
app.use("/api/justdoit/userNotifications",tokenChecker,notificationRoute);
app.use("/api/justdoit/answerComments",tokenChecker,commentRoutes);
app.use("/api/justdoit/adds",addsRoute);
//NOT FOUND ERROR
app.use(function(req,res){ 
    return  res.status(404).json({error:"Sorry, the page you are looking for was not found "});
  });

//RUNNING FOR ONCE A WEEK
 //var job=new cronJob('3 7 * * 1',function(){
  //sendWeeklyEmail();
  //sendNotifications();
 // },null,true,'Africa/Kigali');

  //job.start();  

 //var job2=new cronJob("19 12 * * 5",function(){
 //  happyWeekEmail();
 // },null,true,'Africa/Kigali');
 
 //job2.start();

//LISTENING TO THE PORT

const port=process.env.PORT || 5500;
app.listen(port, () =>{

    log(`App running on port ${port}`);
})
