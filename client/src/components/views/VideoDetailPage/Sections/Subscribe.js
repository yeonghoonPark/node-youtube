import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscribe(props) {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };
    axios.post("/api/subscribe/subscribeNumber", variable).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
        console.log(res.data, "레스.data");
      } else {
        alert("구독자 수 정보를 받아오지 못했습니다.");
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };
    axios.post("/api/subscribe/subscribed", subscribedVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
        console.log(res.data, "레스.데이타");
      } else {
        alert("정보를 가져오지 못했습니다.");
      }
    });
  }, [props.userTo]);

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? "#AAAAAA" : "#CC0000"}`,
          border: "none",
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick
      >
        {subscribeNumber} {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
