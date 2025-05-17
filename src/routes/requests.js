const express = require("express");
const requestouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const ConnectionRequest = require("../../models/connectionRequest");
const User = require("../../models/user");

requestouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validate the status
      const allowedStatusTypes = ["interested", "ignored"];
      if (!allowedStatusTypes.includes(status)) {
        return res.status(400).json({ message: "Invalild Requested Status" });
      }

      //if there is already exiasting Connectionreq
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists" });
      }

      //send request only if that user exists in our db
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :: " + err.message);
    }
  }
);

requestouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //validate the status
      const allowedStatusTypes = ["accepted", "rejected"];
      if (!allowedStatusTypes.includes(status)) {
        return res.status(400).json({ message: "Invalild Requested Status" });
      }

      //supoose samay => raina
      // loggedInUser = touserid
      //status = interested rejected
      //requestId should be valid
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      console.log(requestId, loggedInUser._id, status);
      //check if raina is loggedIn
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status; //modify the status then save it

      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR :: " + err.message);
    }
  }
);

module.exports = requestouter;
