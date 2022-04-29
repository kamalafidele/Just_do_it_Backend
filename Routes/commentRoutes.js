const router = require("express").Router();
const { addComment, getAnswerComments } = require("../Controllers/comments/commentsController");

router.get("/answerComments",getAnswerComments);
router.post("/addComment",addComment);

module.exports = router;