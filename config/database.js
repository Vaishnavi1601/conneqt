const mongoose = require('mongoose');

const connectDB = async() =>{
  await mongoose.connect("mongodb+srv://vaishnavi:2bB6USxXx9ggixEu@cluster0.h45cjzn.mongodb.net/conneqt");
}

module.exports = connectDB;

