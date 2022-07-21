import React, { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import { useForm } from "react-hook-form";
import Field from "../components/field/Field";
import { Label } from "../components/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import InputPasswordToggle from "../components/input/InputPasswordToggle";

const SignInPage = () => {
  const schema = yup.object({
    email: yup
      .string()
      .email("Please enter valid email address")
      .required("Please enter your email address"),
    password: yup
      .string()
      .min(8, "Please enter at least 8 characters or greater")
      .required("Please enter your password"),
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login Page";
    if (userInfo?.email) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);
  const handleSignIn = async (values) => {
    if (!isValid) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/");
    } catch (error) {
      if (error.message.includes("wrong-password")) {
        toast.error("It seems your password was wrong");
      }
      if (error.message.includes("user-not-found")) {
        toast.error("This email is not registered");
      }
    }
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
  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email address"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="have-account">
          <NavLink to={"/sign-up"}>You have not an account?</NavLink>
        </div>
        <Button
          style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          SignIn
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
