import React from "react";
import { LoadingSkeleton } from "../loading";

const PostItemSkeleton = () => {
  return (
    <div className="w-full h-[272px] rounded-md">
      <LoadingSkeleton
        width="100%"
        height="100%"
        radius="8px"
      ></LoadingSkeleton>
    </div>
  );
};

export default PostItemSkeleton;
