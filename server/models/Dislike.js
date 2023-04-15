const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const DislikeSchema = mongoose.Schema(
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

const Dislike = mongoose.model("Dislike", DislikeSchema);

module.exports = { Dislike };
