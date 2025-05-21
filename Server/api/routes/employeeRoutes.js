const express = require("express");
const router = express();
const employeeControllers = require("../controllers/employeeController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRoles = require("../middlewares/verifyRoles");

//create an employee
router.post("/add-user",verifyToken,verifyRoles("admin"), employeeControllers.addUser);

//get all Employees
router.get(
  "/get-all",
  verifyToken,
  verifyRoles("admin"),
  employeeControllers.getAllEmployees
);

//setup account
router.patch("/setup-account", employeeControllers.setupAccount);

//updateUser
router.patch(
  "/:id",
  verifyToken,
  verifyRoles("admin"),
  employeeControllers.updateEmployee
);

//deleteUser
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRoles("admin"),
  employeeControllers.deleteEmployee
);

//login
router.post("/login", employeeControllers.login);

//google login
router.post("/google-login", employeeControllers.googleLogin);

//get Sigle User
router.get("/me", verifyToken, employeeControllers.getSingleEmployee);

//get
router.get("/roles",verifyToken,employeeControllers.getRole)

//getAdmin
//router.get("/roles", verifyToken, employeeControllers.getRole);

//createAdmin
// router.put(
//   "/admin/:id",
//   verifyToken,
//   verifyRoles("admin"),
//   userControllers.createAdmin
// );

module.exports = router;
