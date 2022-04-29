const router = require("express").Router();

const { addQuestion, getTopicQuestions, getAllQuestions } = require("../Controllers/questions/questionController.js");

router.post("/addQuestion",addQuestion);
router.get("/allQuestions",getAllQuestions);
router.get("/topicQuestions/:workspaceId",getTopicQuestions);

module.exports = router;