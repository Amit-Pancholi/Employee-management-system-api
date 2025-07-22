const mongoose = require("mongoose");
exports.startConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Test DB connected");
  } catch (err) {
    console.error("❌ Error connecting to Test DB:", err.message);
    // If connection fails, fail the test suite immediately
    process.exit(1);
  }
};

exports.endConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 Test DB connection closed");
  } catch (err) {
    console.error("❌ Error closing Test DB connection:", err.message);
  }
};
