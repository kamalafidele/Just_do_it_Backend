const express=require("express");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const userRoutes=require("./Routes/userRoutes");
const workspaceRoutes=require("./Routes/workspaceRoute");
const tokenChecker=require("./Middlewares/tokenAuth");
const questionsRoute=require("./Routes/questionsRoute");
const answerRoute=require("./Routes/answerRoutes");
const filesRoute=require("./Routes/fileRoutes");
const notificationRoute=require("./Routes/notificationRoute");

//Database connection
const URL="mongodb+srv://fidele:123@cluster0.n9af1.mongodb.net/justdoitrw?retryWrites=true&w=majority";
mongoose.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true})
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
    origin: ['https://justdoit-rw.tech/'],
    optionsSuccessStatus: 200 
  }

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({limit:'2mb',extended:true}));
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
//NOT FOUND ERROR
app.use(function(req,res){ 
    return  res.status(404).json({error:"Sorry, the page you are looking for was not found "});
  });


//LISTENING TO THE PORT

const port=process.env.PORT || 5500;
app.listen(port, () =>{

    log(`App running on port ${port}`);
})