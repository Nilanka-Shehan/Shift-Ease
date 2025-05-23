const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
require("./autoUpdate");
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on failure
  });


//Server End points
const employeeRoutes = require("./api/routes/employeeRoutes");
const requestRoutes = require("./api/routes/requestRoutes");

app.use("/user", employeeRoutes);
app.use("/request", requestRoutes);

// Start the server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
