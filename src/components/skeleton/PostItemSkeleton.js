import React from "react";
import { LoadingSkeleton } from "../loading";

const PostItemSkeleton = ({ height = "272px" }) => {
  return (
    <div className={`w-full h-[${height}] rounded-md`}>
      <LoadingSkeleton
        width="100%"
        height="100%"
        radius="8px"
      ></LoadingSkeleton>
    </div>
  );
};

export default PostItemSkeleton;
