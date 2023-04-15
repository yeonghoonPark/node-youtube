const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true },
);

const Like = mongoose.model("Like", LikeSchema);

module.exports = { Like };
