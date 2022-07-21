import React from "react";
import { Button } from "../../components/button";
import { useAuth } from "../../context/auth-context";
import { userRole } from "../../utils/contants";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";

const UserManage = () => {
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) {
    return <h3 className="text-center">You do not have access to this item</h3>;
  }
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button to="/manage/add-user" type="button" kind="ghost">
          Add new User
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
