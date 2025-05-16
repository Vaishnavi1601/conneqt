var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //Read the token from the req cookies
  console.log("req",req.cookies)
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedObj = await jwt.verify(token, "Conneqt@123");

    //validate the token
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user= user;
    next()
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
};

module.exports = { userAuth };
