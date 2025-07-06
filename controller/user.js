import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import sendOTP from "../utils/sendOTP.js";
import TryCatch from "../utils/TryCatch.js";
import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const subject = "Ecommerce App";

  const otp = Math.floor(Math.random() * 1000000);

  const prevOtp = await OTP.findOne({
    email,
  });

  if (prevOtp) {
    await prevOtp.deleteOne();
  }

  await sendOTP({ email, subject, otp });

  await OTP.create({ email, otp });

  res.json({
    message: "OTP sent to your mail",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await OTP.findOne({
    email,
    otp,
  });

  if (!haveOtp) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();
    res.json({ message: "User LoggedIn", token, user });
  } else {
    user = await User.create({
      email,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();
    res.json({ message: "User LoggedIn", token, user });
  }
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});
