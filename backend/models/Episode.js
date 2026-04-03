import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
  {
    series: {
      type: String,
      required: true,
      enum: ["Dragon Ball", "Dragon Ball Z", "Dragon Ball GT", "Dragon Ball Daima"]
    },
    title: { type: String, required: true },
    episode_number: { type: Number, required: true },
    saga: { type: String, default: "" },
    overview: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    episode_link: { type: String, required: true },
    duration: { type: String, default: "" },
    air_date: { type: String, default: "" }
  },
  { timestamps: true }
);

const Episode = mongoose.model("Episode", episodeSchema);
export default Episode;
