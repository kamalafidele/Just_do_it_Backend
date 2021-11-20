const router=require("express").Router();

const {addAnswer,getQuestionAnswers,upVote,downVote}=require("../Controllers/answers/answerController")

router.post("/addAnswer",addAnswer);
router.get("/questionAnswers",getQuestionAnswers);
router.post("/upVoteAnswer",upVote);
router.post("/downVoteAnswer",downVote);

module.exports=router;