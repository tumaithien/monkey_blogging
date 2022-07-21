import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Button } from "../../components/button";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import { userRole, userStatus } from "../../utils/contants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase-app/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const schema = yup.object({
  fullname: yup.string().required("Please enter full name"),
  username: yup
    .string()
    .min(8, "Please enter at least 8 characters or greater")
    .required("Please enter username"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter email address"),
  password: yup
    .string()
    .min(8, "Please enter at least 8 characters or greater")
    .required("Please enter password"),
});
const UserAddNew = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      avatar: "",
    },
    resolver: yupResolver(schema),
  });
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const {
    image,
    progress,
    handleResetUpload,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  useEffect(() => {
    document.title = "Monkey Blogging - Add News User";
  }, []);
  useEffect(() => {
    const arrayErrors = Object.values(errors);
    if (arrayErrors.length > 0) {
      toast.error(arrayErrors[0]?.message, {
        pauseOnHover: false,
        delay: 100,
      });
    }
  }, [errors]);
  //Add user from dashboard to firebase
  const handleCreateUser = async (values) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      const cloneValues = { ...values };
      cloneValues.username = slugify(
        cloneValues.username || cloneValues.fullname,
        { lower: true, locale: "vi", trim: true, replacement: "" }
      );
      cloneValues.status = Number(cloneValues.status);
      cloneValues.role = Number(cloneValues.role);
      await addDoc(collection(db, "users"), {
        ...cloneValues,
        avatar: image,
        createAt: serverTimestamp(),
      });
      toast.success(`Create user with email: ${values.email} successfully!!!`);
      reset({
        fullname: "",
        username: "",
        email: "",
        password: "",
        avatar: "",
        status: userStatus.ACTIVE,
        role: userRole.USER,
      });
      handleResetUpload();
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        toast.error("Email already in use");
      }
    }
  };
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCreateUser)}>
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
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
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
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
