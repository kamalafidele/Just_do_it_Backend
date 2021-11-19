const router=require("express").Router();
const { addWorkspace, getWorkspaces,addUserWorkspaces,getUserWorkspaces} = require("../Controllers/workspaces/addWorkspace");


router.post("/addWorkspace",addWorkspace)
router.get("/allWorkspaces",getWorkspaces);
router.post("/addUser_workspaces",addUserWorkspaces);
router.get("/userWorkspaces",getUserWorkspaces);

module.exports=router;