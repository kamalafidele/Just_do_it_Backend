const express=require("express");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const userRoutes=require("./Routes/userRoutes");
const workspaceRoutes=require("./Routes/workspaceRoute");
const tokenChecker=require("./Middlewares/tokenAuth");
const questionsRoute=require("./Routes/questionsRoute");

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
    origin: ['http://localhost:4200'],
    optionsSuccessStatus: 200 
  }

dotenv.config();
app.use(cors());
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({limit:'2mb',extended:true}));
app.use(logger);

//Routes
app.use("/api/justdoit/users",userRoutes);
app.use("/api/justdoit/workspaces",tokenChecker,workspaceRoutes);
app.use("/api/justdoit/questions",tokenChecker,questionsRoute);
//NOT FOUND ERROR
app.use(function(req,res){ 
    return  res.status(404).json({error:"Sorry, the page you are looking for was not found "});
  });


//LISTENING TO THE PORT

const PORT=process.env.PORT || 3400;
app.listen(PORT, () =>{

    log(`App running on port ${PORT}`);
})