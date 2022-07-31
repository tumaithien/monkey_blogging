import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { Label } from "../../components/label";
import { useAuth } from "../../context/auth-context";
import { db } from "../../firebase-app/firebase-config";
import useFirebaseImage from "../../hook/useFirebaseImage";
import DashboardHeading from "../dashboard/DashboardHeading";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  password: yup
    .string()
    .min(8, "Please enter at least 8 characters or greater")
    .required("Please enter your password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const UserProfile = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  console.log(userInfo);
  const { uid: userId } = userInfo;
  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const {
    image,
    progress,
    handleResetUpload,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  useEffect(() => {
    async function fetchUserNow() {
      if (!userId) return;
      const docRef = doc(db, "users", userId);
      const singleDoc = await getDoc(docRef);
      reset(singleDoc && singleDoc.data());
    }
    fetchUserNow();
  }, [reset, userId]);
  useEffect(() => {
    const arrayErrors = Object.values(errors);
    if (arrayErrors.length > 0) {
      toast.error(arrayErrors[0]?.message, {
        pauseOnHover: false,
        delay: 100,
      });
    }
  }, [errors]);
  const handleUpdateProfile = async (values) => {
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      handleResetUpload();
      toast.success("Update user profile successfully!!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Update profile failed");
    }
  };

  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="text-center mb-10">
          <ImageUpload
            className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
            name="image"
            progress={progress}
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            image={image}
          ></ImageUpload>
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
            <Label>New password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
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
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          kind="primary"
          className="mx-auto w-[200px]"
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
