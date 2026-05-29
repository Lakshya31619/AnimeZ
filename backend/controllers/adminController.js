import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const getDashboardData = async (req, res) => {
  try {

    const activeMovies  = await Movie.find({});
    const totalUser     = await User.countDocuments();
    const totalComments = await Comment.countDocuments();

    res.json({
      success: true,
      activeMovies,
      totalUser,
      totalComments
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { search = "", type = "", page = 1 } = req.query;
    const limit = 20;
    const skip  = (Number(page) - 1) * limit;

    const filter = {};
    if (type)   filter.contentType = type;
    if (search) filter.text = { $regex: search, $options: "i" };

    const [comments, total] = await Promise.all([
      Comment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Comment.countDocuments(filter)
    ]);

    res.json({ success: true, comments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) return res.status(404).json({ success: false, message: "Comment not found" });
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};