import mongoose from "mongoose";

/** 리뷰 정보 */
const review = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
  brand: { type: String },
  product: { type: String },
  image: [{ type: String }],
  motivation: { type: String },
  adventages: { type: String },
  disadventages: { type: String },
  keywords: [{ type: String }],
  score: { type: Number },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [{ type: String }],
  uploadDate: { type: Date, default: Date.now() },
});

const Review = mongoose.model("Review", review);
export default Review;
