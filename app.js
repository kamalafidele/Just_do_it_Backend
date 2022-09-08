const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cronJob = require("cron").CronJob;
require("dotenv").config();

// ROUTES 
const userRoutes = require("./Routes/userRoutes");
const workspaceRoutes = require("./Routes/workspaceRoute");
const questionsRoute = require("./Routes/questionsRoute");
const answerRoute = require("./Routes/answerRoutes");
const filesRoute = require("./Routes/fileRoutes");
const notificationRoute = require("./Routes/notificationRoute");
const addsRoute = require("./Routes/addRoutes");
const commentRoutes = require("./Routes/commentRoutes");

//  MIDDLEWARES
const {sendWeeklyEmail, happyWeekEmail, sendNotifications} = require("./dailyCheck");
const tokenChecker = require("./Middlewares/tokenAuth");

//Database connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then( _=>{
    console.log("APP CONNECTED ON DB");
}).catch(err =>{console.log("Connecting to db errors: ",err)});



//Middlewares
let log = console.log;
const logger = (req,res,next) => {
    log(req.url+" "+req.method);
    next();
}

var corsOptions = {
    origin: ['https://justdoit-rw.tech','http://localhost:4200'],
    optionsSuccessStatus: 200 
  }

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '40mb', extended: true }));
app.use(cors(corsOptions));

app.use(logger);
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//Routes
app.get("/", (req,res) => res.sendFile(__dirname + "/views/Index.html"));
app.use("/api/justdoit/users", userRoutes);
app.use("/api/justdoit/workspaces", tokenChecker, workspaceRoutes);
app.use("/api/justdoit/questions", tokenChecker, questionsRoute);
app.use("/api/justdoit/answers", tokenChecker, answerRoute);
app.use("/api/justdoit/userFiles", tokenChecker, filesRoute);
app.use("/api/justdoit/userNotifications", tokenChecker, notificationRoute);
app.use("/api/justdoit/answerComments", tokenChecker, commentRoutes);
app.use("/api/justdoit/adds", addsRoute);

//NOT FOUND ERROR
app.use((req,res) =>  res.status(404).sendFile(__dirname + "/views/Index.html") );

//RUNNING FOR ONCE A WEEK
 var job = new cronJob('30 12 * * 4',function(){
  sendWeeklyEmail();
  //sendNotifications();
 },null,true,'Africa/Kigali');

  job.start();  

 var job2 = new cronJob("30 18 * * 5",function(){
  happyWeekEmail();
 },null,true,'Africa/Kigali');
 
 job2.start();

//LISTENING TO THE PORT

const port = process.env.PORT || 5500;
app.listen(port, () =>{
    log(`App running on port ${port}`);
})
