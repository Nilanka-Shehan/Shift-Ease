const express = require("express");
const router = express();
const historyController = require("../controllers/historyController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRoles = require("../middlewares/verifyRoles");

//delete request
router.get("/search/:empNumber",verifyToken,verifyRoles("admin"),historyController.searchedRequests);

//get All requests
router.get("/get-history",verifyToken,verifyRoles("admin"),historyController.getFullHistory);

//update request
router.delete("/delete-one/:id",verifyToken,verifyRoles("admin"),historyController.deleteRequest);

//delete requests
router.delete("/delete-all",verifyToken,verifyRoles("admin"),historyController.deleteAllRequests);

module.exports = router;