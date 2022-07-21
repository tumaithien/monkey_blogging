import React from "react";

const LoadingSkeleton = (props) => {
  return (
    <div
      className={`skeleton ${props.className}`}
      style={{
        height: props.height,
        width: props.width || "100%",
        borderRadius: props.radius || "0",
      }}
    ></div>
  );
};

export default LoadingSkeleton;
