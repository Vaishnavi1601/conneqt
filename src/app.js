const express = require("express");
const app = express();
const connectDB = require("../config/database");
var cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
app.use(express.json()); //reads the json obj converts it into js obj and add that obj to request body
app.use(cookieParser()); //It reads the Cookie header from incoming HTTP requests, Then it parses that string and adds a cookies object to the req.


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
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
