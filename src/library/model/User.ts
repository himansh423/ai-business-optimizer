import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  email:{type:String, required:true},
  password:{type:String, select:false},
  googleId:{type:String},
});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);
export default User;