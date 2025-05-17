const mongoose = require("mongoose");
const validator = require("validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      index: true
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter valid email Id" + value);
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //create a custom validate function
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.ihna.edu.au/blog/user-dummy/",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter valid photo" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default section and default description about me",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Conneqt@123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  console.log("passwordInputByUser ",passwordInputByUser);
  const hashedPassword = user.password;
  console.log("hashedPassword ",hashedPassword);

  const isPasswordValid = bcrypt.compareSync(
    passwordInputByUser,
    hashedPassword
  );
  console.log("isPasswordValid ",isPasswordValid);

  return isPasswordValid;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
