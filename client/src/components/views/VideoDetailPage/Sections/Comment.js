import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector((state) => state.user);

  const [commentValue, setCommentValue] = useState("");

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      postId: videoId,
      content: commentValue,
    };

    axios.post("/api/comment/savecomment", variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result, "레스.데이타.리설트");
        setCommentValue("");
        props.refreshFunction(res.data.result);
      } else {
        alert("Failed to save comment");
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map((cV, i) => {
          return (
            !cV.responseTo && (
              <div key={i}>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={cV}
                  postId={videoId}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={cV._id}
                  postId={videoId}
                  commentLists={props.commentLists}
                />
              </div>
            )
          );
        })}

      {/* RootComment Form */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleChange}
          value={commentValue}
          placeholder='Please write a comment'
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
