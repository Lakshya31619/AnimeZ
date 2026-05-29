import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    contentType: {
      type: String,
      enum: ["episode", "movie"],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    clerkId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userImage: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

commentSchema.index({ contentId: 1, contentType: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;