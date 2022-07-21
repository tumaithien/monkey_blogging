import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserProfile = () => {
  const { control } = useForm({
    mode: "onChange",
  });
  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form>
        <div className="text-center mb-10">
          <ImageUpload className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              control={control}
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              control={control}
              placeholder="Enter your username"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Date of Birth</Label>
            <Input
              name="birthday"
              control={control}
              placeholder="dd/mm/yyyy"
            ></Input>
          </Field>
          <Field>
            <Label>Mobile Number</Label>
            <Input
              name="mobile"
              control={control}
              placeholder="Enter your mobile number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              control={control}
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field></Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>New password</Label>
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"
            ></Input>
          </Field>
          <Field>
            <Label>Confirm password</Label>
            <Input
              control={control}
              placeholder="Enter your confirm password"
              name="confirmPassword"
              type="password"
            ></Input>
          </Field>
        </div>
        <Button kind="primary" className="mx-auto w-[200px]">
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
