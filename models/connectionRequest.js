const mongoose = require("mongoose");

const sendConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      required: true,
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

sendConnectionRequestSchema.index({fromUserId: 1, toUserId : 1});

sendConnectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    const err = new Error("Cannot send request to yourself.");
    return next(err); // Passes error to Mongoose, stops saving
  }
  next(); // No issue, proceed with saving
});


const ConnnectionRequestModel = new mongoose.model("connectionRequest", sendConnectionRequestSchema)

module.exports = ConnnectionRequestModel;