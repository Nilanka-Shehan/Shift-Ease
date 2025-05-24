const History = require("../models/historyModel");

//get full history
const getFullHistory = async (req, res) => {
  try {
    const requests = await History.find();
    if (!requests) {
      return res.status(204).json({ message: "No content!" });
    }
    return res.status(200).json(requests);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Failed to fetch requests: ${error.message}` });
  }
};

//delete a request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await History.findByIdAndDelete(id);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Request deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

//delete all request
const deleteAllRequests = async (req, res) => {
  try {
    const requests = await History.deleteMany({});
    if (!requests) {
      return res.status(204).json({ message: "No content!" });
    }
    return res
      .status(200)
      .json({ message: "Clear the History successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

//Search a requests by empNumber
const searchedRequests = async (req, res) => {
  const empNumber = req.params;
  try {
    const requests = await History.find(empNumber);
    if (!requests) {
      return res
        .status(404)
        .json({ message: "Request not found", success: false });
    }
    return res.status(200).json({ result:requests, success: true });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = {
  getFullHistory,
  deleteRequest,
  deleteAllRequests,
  searchedRequests,
};
