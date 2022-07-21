import React, { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

import { Input } from "../components/input";
import { Label } from "../components/label";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import Field from "../components/field/Field";
import { auth, db } from "../firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import { userRole, userStatus } from "../utils/contants";
import slugify from "slugify";

const schema = yup.object({
  fullname: yup.string().required("Please enter your full name"),
  username: yup
    .string()
    .min(8, "Please enter at least 8 characters or greater")
    .required("Please enter your username"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Please enter at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handleSignUp = async (values) => {
    if (!isValid) return;
    const slugAuthor = slugify(values.fullname, {
      lower: true,
      locale: "vi",
      trim: true,
    });
    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.username,
      photoURL: "",
    });
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      displayName: values.username,
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: values.username,
      avatar: "",
      slug: slugAuthor,
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createAt: serverTimestamp(),
    });
    // await addDoc(colRef, {
    //   fullname: values.fullname,
    //   email: values.email,
    //   password: values.password,
    // });
    toast.success("Register Successfully!");
    navigate("/");
  };
  useEffect(() => {
    const arrayErrors = Object.values(errors);
    if (arrayErrors.length > 0) {
      toast.error(arrayErrors[0]?.message, {
        pauseOnHover: false,
        delay: 100,
      });
    }
  }, [errors]);
  useEffect(() => {
    document.title = "Register Page";
  }, []);
  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignUp)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            name="fullname"
            control={control}
            placeholder="Enter your full name"
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            control={control}
            placeholder="Enter your username"
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            name="email"
            control={control}
            placeholder="Enter your email"
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="have-account">
          <NavLink to="/sign-in">You already have an account?</NavLink>
        </div>
        <Button
          style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          SignUp
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
