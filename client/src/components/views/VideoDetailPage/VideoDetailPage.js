import React, { useEffect, useState } from "react";

import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };

  const [videoDetail, setVideoDetail] = useState([]);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getvideodetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("failed to get video information");
      }
    });

    axios.post("/api/comment/getcomments", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.comments, "레스.데이타.코멘트스");
        setComments(res.data.comments);
      } else {
        alert("failed to get comments information");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFunction = (newComment) => {
    setComments(comments.concat(newComment));
  };

  if (videoDetail.writer) {
    const subscribeButton = videoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={videoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );
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
              actions={[
                <LikeDislikes
                  video
                  userId={localStorage.getItem("userId")}
                  videoId={videoId}
                />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={videoDetail.writer.image}
                title={videoDetail.writer.name}
                description={videoDetail.writer.description}
              />
            </List.Item>

            {/* Comments */}
            <Comment
              refreshFunction={refreshFunction}
              commentLists={comments}
              postId={videoId}
            />
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
