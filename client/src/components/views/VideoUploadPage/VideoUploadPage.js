import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { PromiseProvider } from "mongoose";

const { Title } = Typography;
const { TextArea } = Input;

const videoPrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const videoCategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoPrivate, setVideoPrivate] = useState(0);
  const [videoCategory, setVideoCategory] = useState("Film & Animation");

  const [videoFilePath, setVideoFilePath] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoThumbnailPath, setVideoThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setVideoDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setVideoPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    setVideoCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    // console.log(files, "파일스");

    axios.post("/api/video/uploadfiles", formData, config).then((res) => {
      if (res.data.success) {
        console.log(res.data, "레스.데이타비디오");

        let variable = {
          url: res.data.url,
          fileName: res.data.filename,
        };

        setVideoFilePath(res.data.url);

        axios.post("/api/video/thumbnail", variable).then((res) => {
          if (res.data.success) {
            console.log(res.data, "레스.데이타썸네일");
            setVideoDuration(res.data.fileDuration);
            setVideoThumbnailPath(res.data.url);
          } else {
            alert("thumbnail creation failed");
          }
        });
      } else {
        alert("video upload failed");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let variables = {
      writer: user.userData._id,
      title: videoTitle,
      description: videoDescription,
      privacy: videoPrivate,
      filePath: videoFilePath,
      category: videoCategory,
      duration: videoDuration,
      thumbnail: videoThumbnailPath,
    };

    axios.post("/api/video/uploadvideo", variables).then((res) => {
      if (res.data.success) {
        message.success("video upload is success");
        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("video upload is failed");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop zone */}
          <Dropzone
            onDrop={onDrop}
            // 파일을 멀티로 여러개 올릴 것이냐?
            multiple={false}
            // 파일의 최대크기
            maxSize={10000000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type='plus' style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {/* Thumbname */}
          <div>
            {videoThumbnailPath && (
              <img
                src={`http://localhost:5000/${videoThumbnailPath}`}
                alt='thumbnail'
              />
            )}
          </div>
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={videoTitle} />

        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={videoDescription} />

        <br />
        <br />
        <select onChange={onPrivateChange}>
          {videoPrivateOptions.map((cV, i) => {
            return (
              <option key={i} value={cV.value}>
                {cV.label}
              </option>
            );
          })}
        </select>

        <br />
        <br />
        <select onChange={onCategoryChange}>
          {videoCategoryOptions.map((cV, i) => {
            return (
              <option key={i} value={cV.value}>
                {cV.label}
              </option>
            );
          })}
        </select>

        <br />
        <br />
        <Button type='primary' size='large' onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
