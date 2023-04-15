import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);

  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  const onClickReplyOpen = () => {
    setOpenReply(!openReply);
  };

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const actions = [
    <span onClick={onClickReplyOpen} key='comment-basic-reply-to'>
      Reply to
    </span>,
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: commentValue,
    };

    axios.post("/api/comment/savecomment", variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result, "레스.데이타.리설트");
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(res.data.result);
      } else {
        alert("Failed to save comment");
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt='image' />}
        content={<p>{props.comment.content}</p>}
      />

      {openReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={commentValue}
            placeholder='Please write a reply'
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
