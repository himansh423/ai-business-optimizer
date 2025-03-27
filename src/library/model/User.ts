import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, select: false },
  googleId: { type: String },
  image: { type: String },
  business: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);
export default User;
