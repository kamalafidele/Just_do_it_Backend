const router=require("express").Router();
const {getAllAdds, getSingleAdd,addAdd,updateAddClicks}=require("../Controllers/adds/addController");

router.get("/",getAllAdds)
router.get("/add/addId",getSingleAdd);
router.post("/addingAdd",addAdd);
router.put("/updatingClicks",updateAddClicks);

module.exports=router;
