const router=require("express").Router();

const {addAnswer,getQuestionAnswers}=require("../Controllers/answers/answerController")

router.post("/addAnswer",addAnswer);
router.get("/questionAnswers",getQuestionAnswers);

module.exports=router;