const mongoose = require("mongoose");
const Employees = require("../models/employeeModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require("axios");

// CRUD operations

//add User
const addUser = async (req, res) => {
  let { empNumber, email } = req.body;
  empNumber = Number(empNumber);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if user already exists
    if (await Employees.findOne({ email })) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    // Generate setup token (valid 48 hours)
    const setupToken = crypto.randomBytes(32).toString("hex");
    const setupExpires = Date.now() + 172800000; // 48 hours in ms

    const newEmployee = new Employees({
      empNumber,
      email,
      role: "user",
      accountSetupToken: setupToken,
      accountSetupExpires: setupExpires,
    });

    await newEmployee.save();

    // Use the helper function to send the setup email
    const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${setupToken}`;
    await sendSetupEmail(email, setupLink);

    res
      .status(201)
      .json({ success: true, message: "Setup email sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User creation failed",
      error: error.message,
    });
  }
};

// Helper to send email
async function sendSetupEmail(email, link) {
  // Configure your SMTP transport (use environment variables for credentials)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Set Up Your Account",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="margin-bottom: 16px;">
        <h2 style="color: #333;">Welcome to ${process.env.SMTP_NAME}!</h2>
        <p>We're excited to have you on board. Please set up your account to get started.</p>
      </div>

      <div style="margin-bottom: 16px;">
        <a href="${link}" 
           style="background-color: #007BFF; color: #ffffff; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Set Up Your Account
        </a>
      </div>

      <div style="color: #555;">
        <p>This link will expire in <strong>24 hours</strong>. If you have any questions, feel free to contact our support team.</p>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
}

//getAll employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.find();
    const formattedEmployees = employees.map((user) => ({
      id: user._id,
      empNumber: user.empNumber,
      username: user.username,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
    }));
    if (!formattedEmployees)
      return res.status(204).json({ message: "No content!" });
    return res.status(200).json(formattedEmployees);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Failed to fetch users: ${error.message}` });
  }
};

//update Employee
const updateEmployee = async (req, res) => {
  const empId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(empId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const { empNumber, username, email } = req.body;
  try {
    const updatedEmployee = await Employees.findByIdAndUpdate(
      empId,
      { empNumber, username, email },
      { new: true, runValidators: true }
    );
    if (!updatedEmployee)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Successfully updated Employee!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update user: ${error.message}` });
  }
};

const setupAccount = async (req, res) => {
  const { token, username, password } = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Password must be 6+ characters" });
  }

  try {
    const user = await Employees.findOne({
      accountSetupToken: token,
      accountSetupExpires: { $gt: Date.now() },
    }).select("+accountSetupToken +accountSetupExpires");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Update user details
    user.username = username;
    user.password = password;
    user.accountSetupToken = undefined;
    user.accountSetupExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account setup complete. You may now login.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Setup failed",
      error: error.message,
    });
  }
};

//delete Employee
const deleteEmployee = async (req, res) => {
  const empId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(empId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedEmployee = await Employees.findByIdAndDelete(empId);
    if (!deletedEmployee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Successfully deleted Employee!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to delete user: ${error.message}` });
  }
};

//Other OPeration

//getSingle Employee
const getSingleEmployee = async (req, res) => {
  const empId = req.decoded.id;

  if (!mongoose.Types.ObjectId.isValid(empId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const employee = await Employees.findById(empId);
    !employee
      ? res.status(404).json({ message: "Employee not found" })
      : res.status(200).json({
          success: true,
          employee: {
            id: employee._id,
            empNumber: employee.empNumber,
            username: employee.username,
            email: employee.email,
            role: employee.role,
            photoURL: employee.photoURL,
            createdAt: employee.createdAt,
          },
        });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to get single user: ${error.message}` });
  }
};

//get Role
const getRole = async (req, res) => {
  try {
    const empId = req.decoded.id;
    const employee = await Employees.findById(empId);
    !employee
      ? res.status(404).json({ message: "User not Found !" })
      : res.status(200).json({ role: employee.role });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user role" });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const employee = await Employees.findOne({ email });

    if (!employee) {
      return res
        .status(404)
        .json({ message: "User Not Found!, please create an account" });
    }
    // Remove sensitive logs in production
    const auth = await bcrypt.compare(password, employee.password);
    if (!auth) {
      console.log(email,password, employee.password);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: employee._id }, process.env.ACCESS_JWT_TOKEN, {
      expiresIn: "10d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      employee: {
        id: employee._id,
        empNumber: employee.empNumber,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        photoURL: employee.photoURL,
        createdAt: employee.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error); // Improved error logging
    res.status(500).json({ message: "An error occurred during login" });
  }
};

//google login
const googleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing authorization code." });
  }
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code: token,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "postmessage", // required when using popup flow
          grant_type: "authorization_code",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // Get user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract user info
    const { email, sub: googleId, picture, name } = userInfoResponse.data;

    const user = await Employees.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      return res.status(403).json({
        message: "Account not registered. Contact your administrator.",
        success: false,
      });
    }

    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    !user.photoURL && (user.photoURL = picture);
    !user.username && (user.username = name);
    await user.save();

    // Generate JWT token
    const authToken = jwt.sign({ id: user._id }, process.env.ACCESS_JWT_TOKEN, {
      expiresIn: "10d",
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
      },
      token: authToken,
    });
  } catch (error) {
    console.error(
      "Google login backend error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.response?.data?.error || error.message,
    });
  }
};

module.exports = {
  addUser,
  getAllEmployees,
  updateEmployee,
  setupAccount,
  deleteEmployee,
  getSingleEmployee,
  getRole,
  login,
  googleLogin,
};
