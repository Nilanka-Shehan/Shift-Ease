const cron = require("node-cron");
const Requests = require("../Server/api/models/requestModel");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  
  try {
    const result = await Requests.updateMany(
      {
        date: { $lt: now },
        status: "Pending",
      },
      { $set: { status: "Rejected" } }
    );
    console.log(`${result.modifiedCount} expired leave requests rejected.`);
  } catch (error) {
    console.error("Error updating expired leave requests:", error);
  }
});
