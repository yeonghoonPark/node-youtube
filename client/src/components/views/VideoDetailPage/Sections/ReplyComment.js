import React, { useEffect, useState } from "react";

import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;

    props.commentLists.map((cV) => {
      if (cV.responseTo === props.parentCommentId) {
        return commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.commentLists]);

  const renderReplyComment = (parentCommentId) => {
    return props.commentLists.map((cV, i) => (
      <div key={i}>
        {cV.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={cV}
              postId={props.videoId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              parentCommentId={cV._id}
              postId={props.videoId}
              commentLists={props.commentLists}
            />
          </div>
        )}
      </div>
    ));
  };

  const onHadleClick = () => {
    setOpenReplyComments(!openReplyComments);
    console.log(openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: "0 0 3rem", color: "gray" }}
          onClick={onHadleClick}
        >
          View {childCommentNumber} more comment(s)
        </p>
      )}
      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
