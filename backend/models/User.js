import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk userId
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },

  favorites: [
    {
      type: String,
      ref: "Movie"
    }
  ],

  watchlist: [
    {
      type: String,
      ref: "Movie"
    }
  ]
});

const User = mongoose.model("User", userSchema);
export default User;