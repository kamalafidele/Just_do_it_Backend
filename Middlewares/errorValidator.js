const Joi=require("joi");

 
    const resetValidator=Joi.object().keys({
        newPassword:Joi.string().required().min(6).messages({"string.empty":"Please fill the "}),
        retype:Joi.string().required().messages({"string.empty":"Please retype the password to continue"}),
        uniqueNumber:Joi.string().required().messages({"string.empty":"Unique number is needed"})
    });

    const emailValidator=Joi.object().keys({
        email:Joi.string().required().messages({"string.empty":"Please provide your email "})
    })

    const signupValidator=Joi.object().keys({
        username:Joi.string().required().messages({"string.empty":"Please provide your username"}),
        email:Joi.string().email().required().messages({"string.empty":"Please provide your email","string.email":"Please provide a valid email"}),
        password:Joi.string().min(6).max(32).required().messages({"string.empty":"Please provide your password","string.min":"Password must contain at least 6 characters"}),
        confirmPassword:Joi.string().max(32).required().messages({"string.empty":"Retype your password to continue "})
    });

    const loginValidator=Joi.object().keys({
        email:Joi.string().email().required().messages({"string.email":"Provide a valid email please ","string.empty":"Please fill the email field"}),
        password:Joi.string().required().messages({"string.empty":"Password field is required "})
    });


   module.exports={emailValidator,resetValidator,signupValidator,loginValidator};