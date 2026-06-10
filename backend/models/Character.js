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

// History = text-based story/lore entries (separate from video moments)
const historySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  formId: { type: String, default: "" },   // optional: ties this entry to a specific form
  order: { type: Number, default: 0 }
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
  moments: [momentSchema],
  history: [historySchema]

}, { timestamps: true });

// Index for faster queries
characterSchema.index({ createdAt: -1 });

export default mongoose.model("Character", characterSchema);