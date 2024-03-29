const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

// storage multer config
let storage = multer.diskStorage({
  // 파일을 올리면 어디다 저장할지
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // 저장시에 어떤 이름으로 저장할지
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // 어떤 파일 형식을 저장할지
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  // 클라이언트에서 받은 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileNmae: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  // 썸네일을 생성하고 비디오 러닝타임 가져오기

  let filePath = "";
  let fileDuration = "";

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata); // all metadata
    console.log(metadata.format.duration);
    ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.url) // req.body.url = 클라이언트에서 받은 비디오 저장경로
    // 파일네임 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      console.log(filenames, "파일네임스");

      filePath = "uploads/thumbnails/" + filenames[0];
    })
    // 파일네임 생성 후 처리할 일
    .on("end", function () {
      console.log("screenshots taken");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    // 에러가 날 경우 처리할 일
    .on("error", function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    // 스크린샷에 대한 옵션
    .screenshots({
      // will take screenshots at 20%, 40%, 60%, and 80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      // '%b' : input basename (filename w/o extenstion)
      filename: "thumbnail-%b.png",
    });
});

router.post("/uploadvideo", (req, res) => {
  // 비디오정보들을 mongoDB에 저장한다.
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    res.status(200).json({ success: true });
  });
});

router.get("/getvideos", (req, res) => {
  // 클라이언트에서 요청된 비디오들을 mongoDB에서 가져와서 클라이언트로 보낸다.
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getvideodetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ success: true, videoDetail });
    });
});

router.post("/getsubscriptionvideos", (req, res) => {
  // 로컬에 저장 된 아이디를 기반으로 구독하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      let subscribedUser = [];
      subscriberInfo.map((cV) => subscribedUser.push(cV.userTo));

      // 찾은 구독한 사람들의 비디오를 가져온다.
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    },
  );
});

module.exports = router;
