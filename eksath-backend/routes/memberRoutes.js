const express = require("express");
// const memberController=require('../controllers/memberController')
const {getMemberById, getProfileInfo, updateProfileInfo, getMember } = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware"); 

const router = express.Router();


// Route to get member profile information (requires authentication)
router.get("/profile", authMiddleware(), getProfileInfo);
// Route to update member profile information (requires authentication)
router.put("/profile", authMiddleware(), updateProfileInfo);
// Route to get  member info (requires authentication)
router.get("/info", authMiddleware(), getMember);
// Route to get member id object by member_id (requires authentication)
// router.get("/_id/:memberId", authMiddleware(), get_id);
// Route to get member  basic info by member_id(requires authentication)
router.get("/getMemberById/:memberId", authMiddleware(), getMemberById);

//getting admins for work assignments
// router.get("/getAdminsForFuneral", adminController.getAdminsForFuneral);
// router.get("/get-all-data-by-id",authMiddleware(["vice-secretory"]) , getAllDataById);
// get-admin-for-

//create member
// router.post("/create", memberController.createMember);
module.exports = router;
