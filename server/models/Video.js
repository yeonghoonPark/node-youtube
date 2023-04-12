const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    writer: {
      // schema의 아이디를 User에서 가져오면 User스키마의 모든정보를 가져 올 수 있다.
      type: Schema.Types.ObjectId,
      // User스키마에서 가져온다는 설정
      ref: "User",
    },

    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true },
);

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
