const express = require("express");
const router = express();
const requestController = require("../controllers/requestController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRoles = require("../middlewares/verifyRoles");

//create a request or update the existing request
router.post("/create-request",verifyToken,requestController.createOrUpdateLeaveRequest);

//get Single request
router.get("/get-request/:id",verifyToken,requestController.getSingleRequest);

//getAll requests
router.get("/get-all",verifyToken,verifyRoles("admin"),requestController.getRequests);

//update request
router.patch("/update-status/:id",verifyToken,verifyRoles("admin"),requestController.updateRequestStatus);

//delete request
router.delete("/delete/:id",verifyToken,verifyRoles("admin"),requestController.deleteRequest);

module.exports = router;