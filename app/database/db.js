require('dotenv').config();
const mongoose = require('mongoose');

exports.connectMonggose = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Connected to MongoDB: Itern MERN");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
    });
}
