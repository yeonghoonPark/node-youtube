import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import axios from "axios";

function LikeDislikes(props) {
  const [likes, setLikes] = useState(0);
  const [likesAction, setLikesAction] = useState(null);
  const [dislikes, setDislikes] = useState(0);
  const [disikesAction, setDislikesAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    axios.post("/api/like/getlikes", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.likes.legnth, "레스.데이타.라이크스.렝스");
        // 좋아요가 몇개인지
        setLikes(res.data.likes.length);

        // 내가 좋아요를 이미 눌렀는지
        res.data.likes.map((cV) => {
          if (cV.userId === props.userId) {
            setLikesAction("liked");
          }
        });
      } else {
        alert("failed to get likes infomation");
      }
    });

    axios.post("/api/like/getdislikes", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.dislikes.legnth, "레스.데이타.라이크스.렝스");
        // 싫어요가 몇개인지
        setDislikes(res.data.dislikes.length);

        // 내가 싫어요를 이미 눌렀는지
        res.data.dislikes.map((cV) => {
          if (cV.userId === props.userId) {
            setDislikesAction("disliked");
          }
        });
      } else {
        alert("failed to get dislikes infomation");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLike = () => {
    // 좋아요 버튼이 안눌러져 있다면
    if (likesAction === null) {
      axios.post("/api/like/uplike", variable).then((res) => {
        if (res.data.success) {
          setLikes(likes + 1);
          setLikesAction("liked");

          if (disikesAction !== null) {
            setDislikes(dislikes - 1);
            setDislikesAction(null);
          }
        } else {
          alert("failed to like");
        }
      });
    } else {
      axios.post("/api/like/unlike", variable).then((res) => {
        if (res.data.success) {
          setLikes(likes - 1);
          setLikesAction(null);
        } else {
          alert("failed to like");
        }
      });
    }
  };

  const onDislike = () => {
    // 싫어요 버튼이 이미 눌러져 있다면
    if (disikesAction !== null) {
      axios.post("/api/like/undislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(dislikes - 1);
          setDislikesAction(null);
        } else {
          alert("failed to dislike");
        }
      });
    } else {
      axios.post("/api/like/updislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(dislikes + 1);
          setDislikesAction("disliked");

          // 내가 좋아요를 이미 눌렀는지
          if (likesAction !== null) {
            setLikes(likes - 1);
            setLikesAction(null);
          }
        } else {
          alert("failed to dislike");
        }
      });
    }
  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          <Icon
            type='like'
            theme={likesAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {likes} </span>
      </span>
      &nbsp;&nbsp;
      <span key='comment-basic-dislike'>
        <Tooltip title='Dislike'>
          <Icon
            type='dislike'
            theme={disikesAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {dislikes} </span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
