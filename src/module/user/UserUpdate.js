import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Radio } from "../../components/checkbox";
import ImageUpload from "../../components/image/ImageUpload";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { db } from "../../firebase-app/firebase-config";
import { userRole, userStatus } from "../../utils/contants";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { toast } from "react-toastify";
import useFirebaseImage from "../../hook/useFirebaseImage";
import { Textarea } from "../../components/textarea";

const UserUpdate = () => {
  const {
    control,
    reset,
    watch,
    formState: { isSubmitting },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const [params] = useSearchParams();
  const userId = params.get("id");
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, progress, setImage, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);
  async function deleteAvatar(values) {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      ...values,
      avatar: "",
    });
  }
  useEffect(() => {
    async function fetchDataUser() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc && singleDoc.data());
    }
    fetchDataUser();
  }, [userId, reset]);
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);
  const handleUpdateUser = async (values) => {
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        role: Number(values.role),
        avatar: image,
      });
      toast.success("Update user information successfully!!");
    } catch (error) {
      toast.error("Update user failed");
    }
  };
  if (!userId) return;
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            name="image"
            progress={progress}
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Full name</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
                control={control}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BANNED}
                value={userStatus.BANNED}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Description</Label>
            <Textarea name="description" control={control}></Textarea>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update user
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
