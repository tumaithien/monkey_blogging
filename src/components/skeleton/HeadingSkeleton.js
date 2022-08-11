import React from "react";
import { LoadingSkeleton } from "../loading";

const HeadingSkeleton = () => {
  return (
    <div className="w-full h-[49px] rounded-md mb-5">
      <LoadingSkeleton
        width="200px"
        height="100%"
        radius="8px"
      ></LoadingSkeleton>
    </div>
  );
};

export default HeadingSkeleton;
