const router = require("express").Router();

const { addAnswer, getQuestionAnswers, upVote, downVote, getAllAnswers} = require("../Controllers/answers/answerController")

router.post("/addAnswer",addAnswer);
router.get("/questionAnswers/:questionId",getQuestionAnswers);
router.post("/upVoteAnswer",upVote);
router.post("/downVoteAnswer",downVote);
router.get("/allAnswers",getAllAnswers);

module.exports = router;