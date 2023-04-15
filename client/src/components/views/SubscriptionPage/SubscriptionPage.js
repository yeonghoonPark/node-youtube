import React, { useEffect, useState } from "react";
// import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    let subscriptionVariables = {
      userFrom: localStorage.getItem("userId"),
    };

    axios
      .post("/api/video/getsubscriptionvideos", subscriptionVariables)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data, "레스.데이타");
          setVideo(res.data.videos);
        } else {
          alert("failed to load video");
        }
      });
  }, []);

  const renderCards = video.map((cV, i) => {
    let minutes = Math.floor(cV.duration / 60);
    let seconds = Math.floor(cV.duration - minutes * 60);
    return (
      <Col lg={6} md={8} xs={24} key={i}>
        <div style={{ position: "relative" }}>
          <a href={`/video/${cV._id}`}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${cV.thumbnail}`}
              alt='thumbnail'
            />
            <div className='duration'>
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={cV.writer.image} />}
          title={cV.title}
          description=''
        />
        <span>{cV.writer.name}</span>
        <span style={{ marginLeft: "3rem" }}>{cV.views} views</span>
        <span>{moment(cV.createdAt).format("MMMM")}</span>
      </Col>
    );
  });

  return (
    <div
      style={{
        width: "85%",
        margin: "3rem auto",
      }}
    >
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
