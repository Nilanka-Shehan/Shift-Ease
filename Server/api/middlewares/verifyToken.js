const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    // Check for Authorization header
    if (!req.headers.authorization) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // Extract token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token not provided" });
    }

    // Verify token
    jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Invalid Token" });
      }

      // Attach decoded information to the request object
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    // Catch unexpected errors
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = verifyToken;
