import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String },
  displayName: { type: String },
  photoURL: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;