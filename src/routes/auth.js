const express = require("express");
const authRouter = express.Router();
const validator = require("validator");
const { validateSignupData } = require("../../utils/validation");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validating data
    validateSignupData(req.body);

    //ENCRYPTING PASSWROD
    const passwordFromUser = req.body.password;
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(passwordFromUser, saltRounds);
    console.log("passwordHash", passwordHash);
    const { firstName, lastName, emailId, password } = req.body;
    console.log(req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save(); //returs promise
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error signing the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log("Login Deatils ::", req.body);
    const { emailId, password } = req.body;
    //validateLoginCredentials(req.body);
    console.log("validator ::", validator.isEmail(emailId));
    if (!validator.isEmail(emailId)) {
      throw new Error(emailId + " is not valid email Id");
    }
    const loginDeatils = await User.findOne({ emailId: emailId });
    console.log("validator ::", loginDeatils);
    if (!loginDeatils) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await loginDeatils.validatePassword(password);
    console.log("isPasswordValid 2", isPasswordValid);
    if (isPasswordValid) {
      const token = await loginDeatils.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfull !!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Unable to login " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) }).send("Logged Out Succesfully");  //just removing the cookie token
});

module.exports = authRouter;
