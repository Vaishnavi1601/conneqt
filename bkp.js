const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("../config/database");
const User = require("../models/user");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const {
  validateSignupData,
  validateLoginCredentials,
} = require("../utils/validation");

const { userAuth} = require("../middlewares/auth")
app.use(express.json()); //reads the json obj converts it into js obj and add that obj to request body
app.use(cookieParser()); //It reads the Cookie header from incoming HTTP requests, Then it parses that string and adds a cookies object to the req.

//sigining in user
app.post("/signup", async (req, res) => {
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

//login

app.post("/login", async (req, res) => {
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
    console.log("isPasswordValid 2", isPasswordValid)
    if (isPasswordValid) {
      const token = await loginDeatils.getJWT();
      res.cookie("token", token , {expires: new Date(Date.now() + 8 * 3600000)});
      res.send("Login successfull !!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Unable to login " + err.message);
  }
});

//get all users
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({}); //emailId should be same as defined in schema
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

//get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    
    const userDeatils = req.user;
    if(!userDeatils){
      throw new Error("User doesn't exist");
    }
    res.send(userDeatils)
  } catch (err) {
    res.status(400).send("Something went wrong "+err.message);
  }
});

//sendConnectionRequest
app.post("/sendConnReq", userAuth, async(req, res) =>{
  console.log("sending request");
  const user = req.user;
  const firstname = user.firstName;
  res.send( firstname + " sent request");
})
//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail }); //emailId should be same as defined in schema
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

//delete user from db
app.delete("/user", async (req, res) => {
  console.log("req", req.body);
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted sucessfully");
  } catch (err) {
    res.status(400).send("User not found");
  }
});

//update user data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "gender", "about", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      res.status(400).send("Update not Alllowed!!!");
    }

    if (data?.skills.length > 2) {
      res.status(400).send("Max skills!!!");
    }
    console.log("test");
    await User.findByIdAndUpdate(userId, data);
    console.log("test2");
    res.send("User updated sucessfully");
  } catch (err) {
    res.status(400).send("User not found!!!");
  }
});

//connecting to db
connectDB()
  .then(() => {
    console.log("DB connected esatblsished");
    app.listen(7777, () => {
      console.log("server is succesfully listening to port 7777");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to DB");
  });
