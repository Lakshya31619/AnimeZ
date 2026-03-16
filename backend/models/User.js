import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  clerkId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie"
    }
  ],

  watchlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie"
    }
  ]

}, { timestamps: true });

export default mongoose.model("User", userSchema);