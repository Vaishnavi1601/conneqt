const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const validateSignupData = (req) => {
  console.log("req", req);

  const { firstName, lastName, emailId, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Name length should be between 4 - 50");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateLoginCredentials = (req) => {
  const { emailId, password } = req;
  if (!validator.isEmail(emailId)) {
    throw new Error(emailId + " is not valid email Id");
  }
  const loginDeatils = User.findOne({ emailId: emailId });
  if (!loginDeatils) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = bcrypt.compareSync(password, loginDeatils.password);
  if (isPasswordValid) {
    console.log("Login successfull !!!");
  } else {
    throw new Error("Invalid credentials");
  }
};

const validateUpdateDetails = async (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((fields) =>
    ALLOWED_UPDATES.includes(fields)
  );
  if (!isUpdateAllowed) {
    throw new Error("Update not Alllowed!!!");
  }
  return isUpdateAllowed;
};

module.exports = {
  validateSignupData,
  validateLoginCredentials,
  validateUpdateDetails,
};
