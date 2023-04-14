import React, { useEffect, useState } from "react";

import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };

  const [videoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getvideodetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("failed to get video information");
      }
    });
  }, [variable]);

  if (videoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div
            style={{
              width: "100%",
              padding: "3rem 4rem",
            }}
          >
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item
              actions={[<Subscribe userTo={videoDetail.writer._id} />]}
            >
              <List.Item.Meta
                avatar={videoDetail.writer.image}
                title={videoDetail.writer.name}
                description={videoDetail.writer.description}
              />
            </List.Item>

            {/* Comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2rem",
        }}
      >
        ...loading
      </div>
    );
  }
}

export default VideoDetailPage;
