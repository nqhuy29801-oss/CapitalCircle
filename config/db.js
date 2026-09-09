const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUrl = process.env.DB_URL || '';
  try {
    if (!dbUrl) console.log('No database to connect');
    await mongoose.connect(dbUrl).then((data) => {
      console.log('Connect DB success with ' + data.connection.host);
    });
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
