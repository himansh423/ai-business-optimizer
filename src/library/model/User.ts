import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, select: false },
  googleId: { type: String },
  image: { type: String },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  isAgreement: {
    type: Boolean,
    required:true
  },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);
export default User;
