const mongoose = require("mongoose");
const Requests = require("../models/requestModel");
const Employees = require("../models/employeeModel");
const express = require("express");
const History = require("../models/historyModel");
const nodemailer = require("nodemailer");

//CRUD operstions

//Create Request
const createOrUpdateLeaveRequest = async (req, res) => {
  const { empId, date, leaveType, noOfDays } = req.body;
  const leaveDate = new Date(date);
  const now = new Date();

  if (leaveDate < now) {
    return res.status(400).json({
      message: "Leave date cannot be in the past",
      success: false,
    });
  }
  //empId = mongoose.Types.ObjectId(empId);
  try {
    const employee = await Employees.findById(empId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Requset not found" });

    let existingRequest = await Requests.findOne({ empId: empId });
    if (existingRequest) {
      //validate the noOfDays
      if (leaveType === "Annual" && existingRequest.annual < noOfDays) {
        return res.status(400).json({
          message: "Not enough annual leave balance",
          success: false,
        });
      }

      if (leaveType === "Casual" && existingRequest.casual < noOfDays) {
        return res.status(400).json({
          message: "Not enough casual leave balance",
          success: false,
        });
      }
      if (existingRequest.status === "Pending") {
        // Update only fields (NOT leave balances)
        existingRequest.date = date;
        existingRequest.leaveType = leaveType;
        existingRequest.noOfDays = noOfDays;

        await existingRequest.save();
        return res.json({
          message: "Pending request updated",
          success: true,
          request: existingRequest,
        });
      } else if (
        existingRequest.status === "Accepted" ||
        existingRequest.status === "Rejected"
      ) {
        // Create a new request with updated leave balances from employee
        existingRequest.date = date;
        existingRequest.leaveType = leaveType;
        existingRequest.noOfDays = noOfDays;
        existingRequest.status = "Pending";
        // existingRequest.annual = employee.annual;
        // existingRequest.casual = employee.casual;

        await existingRequest.save();
        return res.json({
          message: "New request created after accepted",
          success: true,
          request: existingRequest,
        });
      }
    } else {
      // No request yet → create one

      if (leaveType === "Annual" && 7 < noOfDays) {
        return res.status(400).json({
          message: "Not enough annual leave balance",
          success: false,
        });
      }
      if (leaveType === "Casual" && 14 < noOfDays) {
        return res.status(400).json({
          message: "Not enough casual leave balance",
          success: false,
        });
      }

      const ANNUAL_LEAVE_TOTAL = 7;
      const CASUAL_LEAVE_TOTAL = 14;

      const newRequest = new Requests({
        empId,
        date,
        leaveType,
        noOfDays,
        status: "Pending",
        annual: ANNUAL_LEAVE_TOTAL,
        casual: CASUAL_LEAVE_TOTAL,
      });

      await newRequest.save();
      return res.status(201).json({
        message: "New request created",
        success: true,
        request: newRequest,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: err,
    });
  }
};

//get all requests
const getRequests = async (req, res) => {
  try {
    const requests = await Requests.find();

    const formattedRequests = await Promise.all(
      requests.map(async (request) => {
        const employee = await Employees.findById(request.empId);

        return {
          id: request._id,
          empId: request.empId,
          empNumber: employee ? employee.empNumber : null,
          email: employee ? employee.email : null,
          date: request.date,
          leaveType: request.leaveType,
          noOfDays: request.noOfDays,
          status: request.status,
          createdAt: request.createdAt,
        };
      })
    );
    if (!requests || requests.length === 0) {
      return res.status(204).json({ message: "No content!" });
    }
    return res.status(200).json(formattedRequests);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Failed to fetch requests: ${error.message}` });
  }
};

//update requests
const updateRequestStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  // Validate input status
  if (!["Pending", "Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the request by ID
    const request = await Requests.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const employee = await Employees.findById(request.empId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const history = new History({
      empNumber: employee.empNumber,
      email: employee.email,
      date: request.date,
      leaveType: request.leaveType,
      noOfDays: request.noOfDays,
      annual: request.annual,
      casual: request.casual,
      createdDate: request.createdAt,
      status,
    });

    // Handle status change logic
    if (status === "Accepted") {
      if (request.leaveType === "Annual") {
        if (request.annual < request.noOfDays) {
          return res.status(400).json({
            message: "Not enough annual leave balance",
            success: false,
          });
        }
        request.annual -= request.noOfDays;
      } else if (request.leaveType === "Casual") {
        if (request.casual < request.noOfDays) {
          return res.status(400).json({
            message: "Not enough casual leave balance",
            success: false,
          });
        }
        request.casual -= request.noOfDays;
      }

      // Update the request and employee data
      request.status = "Accepted";
      await Promise.all([request.save()]);
      history.status = "Accepted";
      await history.save();
      await sendSetupEmail(employee.email, request.status);

      return res.json({
        message: "Request accepted and balance updated",
        success: true,
        request,
      });
    } else if (status === "Rejected") {
      // If the status is rejected, just update the request status
      request.status = "Rejected";
      await request.save();
      history.status = "Rejected";
      await history.save();
      await sendSetupEmail(employee.email, request.status);

      return res.json({ message: "Request rejected", success: true, request });
    } else {
      return res.status(400).json({
        message: "Only Pending, Accepted, or Rejected statuses are valid",
        success: false,
      });
    }
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//send setup email to inform user after accepting the request
async function sendSetupEmail(email, status) {
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
    subject: "Leave Request Status Notification",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        
        <!-- Welcome Section -->
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2c3e50;">Welcome to ${process.env.SMTP_NAME}</h2>
          <p>We are writing to inform you about the status of your recent leave request.</p>
        </div>

        <!-- Status Section -->
        <div style="margin-bottom: 20px; font-size: 16px;">
          <p>
            Your initial request is: 
            <strong style="color: ${
              status === "Accepted"
                ? "#28a745"
                : status === "Rejected"
                ? "#d32f2f"
                : ""
            };">
              ${status}
            </strong>.
          </p>
          ${
            status === "Rejected"
              ? `<p style="color: #d32f2f;">Your leave request has been rejected. Please contact your manager for further clarification.</p>`
              : ""
          }
        </div>

        <!-- Footer Info -->
        <div style="font-size: 14px; color: #555;">
          <p>This is an automated message regarding your leave request. No further action is required unless advised otherwise.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

//delete request
const deleteRequest = async (req, res) => {
  const reqId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(reqId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedRequest = await Requests.findByIdAndDelete(reqId);
    if (!deletedRequest)
      return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Successfully deleted Request!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to delete Request: ${error.message}` });
  }
};

//get single request
const getSingleRequest = async (req, res) => {
  const empId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(empId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const request = await Requests.findOne({ empId: empId });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch Request: ${error.message}` });
  }
};

module.exports = {
  createOrUpdateLeaveRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest,
  getSingleRequest,
};
