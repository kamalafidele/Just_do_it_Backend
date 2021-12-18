const router=require("express").Router();

const handleRegister=require("../Controllers/users/registerController")
const handleLogin=require("../Controllers/users/loginController");
const handleEmailVerification=require("../Controllers/users/emailVerifyController")
const googleLogin=require("../Controllers/users/googleLogin");
const {resetPassword,resendCode}=require("../Controllers/users/resetPassword");
const confirmPasswordReset=require("../Controllers/users/confirmPasswordReset");
const {getQuestionAndAnswers} = require("../Controllers/questions/questionController");

router.post("/register",handleRegister);
router.post("/login",handleLogin);
router.post("/confirmEmail",handleEmailVerification);
router.post("/google-login",googleLogin);
router.post("/resetPassword",resetPassword);
router.post("/confirmReset",confirmPasswordReset);
router.post("/resendCode",resendCode);
router.get("/question/:questionId",getQuestionAndAnswers);

module.exports=router;