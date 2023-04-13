import React, { useEffect, useState } from "react";
import axios from "axios";
function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getvideos").then((res) => {
      if (res.data.success) {
        console.log(res.data, "레스.데이타");
        setSideVideos(res.data.videos);
      } else {
        alert("failed to load video");
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((cV, i) => {
    let minutes = Math.floor(cV.duration / 60);
    let seconds = Math.floor(cV.duration - minutes * 60);
    return (
      <div
        key={i}
        style={{
          display: "flex",
          marginBottom: "1rem",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            width: "40%",
            marginRight: "1rem",
          }}
        >
          <a href=''>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${cV.thumbnail}`}
              alt='thumbnail'
            />
          </a>
        </div>

        <div
          style={{
            width: "50%",
          }}
        >
          <a href='' style={{ color: "gray" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>{cV.title}</span>
            <br />
            <span>{cV.writer.name}</span>
            <br />
            <span>{cV.views}</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>
    </>
  );
}

export default SideVideo;
