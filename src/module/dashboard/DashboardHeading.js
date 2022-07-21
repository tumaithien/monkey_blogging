import React from "react";

const DashboardHeading = ({ title = "", desc = "", children }) => {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <div className="dashboard-heading">{title}</div>
        <div className="dashboard-short-desc">{desc}</div>
      </div>
      {children}
    </div>
  );
};

export default DashboardHeading;
