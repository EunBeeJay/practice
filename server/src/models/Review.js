import mongoose from "mongoose";

/** 리뷰 정보 */
const review = mongoose.Schema({
  reviewId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nickname: { type: String },
  category: { type: String },
  brand: { type: String },
  product: { type: String },
  motivation: { type: String },
  adventages: { type: String },
  disadventages: { type: String },
  images: { type: Number, default: 0 },
  keywords: [{ type: String }],
  score: { type: Number },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      nickname: { type: String },
      img: { type: String },
      comment: { type: String },
      createdAt: { type: String },
      replies: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          nickname: { type: String },
          img: { type: String },
          comment: { type: String },
          createdAt: { type: String },
        },
      ],
    },
  ],
  uploadDate: { type: Date, default: Date.now() },
});

const Review = mongoose.model("Review", review);
export default Review;
