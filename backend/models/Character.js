import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  renderLink: {
    type: String
  }
});

const momentSchema = new mongoose.Schema({
  title: String,
  description: String,
  show: String,
  episode: String,
  video: String
});

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  profileLink: {
    type: String,
    required: true
  },
  renderLink: {
    type: String
  },
  forms: [formSchema],
  moments: [momentSchema]

}, { timestamps: true });

// Index for faster queries
characterSchema.index({ createdAt: -1 });

export default mongoose.model("Character", characterSchema);