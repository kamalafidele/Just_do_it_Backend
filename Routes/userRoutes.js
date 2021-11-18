const router=require("express").Router();

const handleRegister=require("../controllers/users/registerController")
const handleLogin=require("../controllers/users/loginController");
const handleEmailVerification=require("../controllers/users/emailVerifyController")
const googleLogin=require("../controllers/users/googleLogin");
const {resetPassword,resendCode}=require("../controllers/users/resetPassword");
const confirmPasswordReset=require("../controllers/users/confirmPasswordReset");


router.post("/register",handleRegister);
router.post("/login",handleLogin);
router.post("/confirmEmail",handleEmailVerification);
router.post("/google-login",googleLogin);
router.post("/resetPassword",resetPassword);
router.post("/confirmReset",confirmPasswordReset);
router.post("/resendCode",resendCode);

module.exports=router;