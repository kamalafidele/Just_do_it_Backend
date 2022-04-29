const router = require("express").Router();
const { uploadProfilePicture } = require("../Controllers/files/FilesController");

router.post("/profilePicture",uploadProfilePicture);

module.exports = router;