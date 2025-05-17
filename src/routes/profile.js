const express = require('express');
const profileRouter = express.Router();
const { userAuth} = require("../../middlewares/auth")
const {validateUpdateDetails} = require("../../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

//update user data
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
   if(!validateUpdateDetails(req)){
    throw new Error("Invalid Edit Req");
   }
    res.send("User updated sucessfullyyaya");
  } catch (err) {
    res.status(400).send("User not found!!!");
  }

  const loggedInUser = req.user;
  console.log("loggedInUser before",loggedInUser)

  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));  //check for respective key and update the value
  await loggedInUser.save();   //saving to db
  console.log("loggedInUser",loggedInUser)
});
module.exports = profileRouter; 