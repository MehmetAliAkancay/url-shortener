const mongoose = require("mongoose");

const db = "mongodb://localhost/urlsDB";

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });

    console.log("Mongodb connected...");
  } catch (err) {
    console.error("Cannot cannot be mongodb. Existing application startup.");
    console.error(err.message);
    process.exit(-1);
  }
};

module.exports = connectDb;
