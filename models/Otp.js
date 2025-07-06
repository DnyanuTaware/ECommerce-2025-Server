import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  //otp will expire in 5 mins
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000), //after 5 mins=> 5min - 60sec (in 1 min)-1000ms(int 1 sec)
    index: { expires: "5m" }, //MongoDB's TTL (Time To Live)It tells MongoDB: "Automatically delete this document 5 minutes after the time in expiresAt."
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
