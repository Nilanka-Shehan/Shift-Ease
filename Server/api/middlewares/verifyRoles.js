const Employees = require("../models/employeeModel");

const verifyRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get the user ID from the decoded token
      const userId = req.decoded.id;

      // Fetch the user from the database
      const user = await Employees.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access Denied" });
      }

      // Attach the user to the request for downstream handlers
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
};

module.exports = verifyRoles;
