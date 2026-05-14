import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Header } from "components/header/Header";
import { loginImage } from "assets/images";
import { emailIcon, lockIcon } from "assets/icons";
import "../auth.scss";
import usePasswordToggle from "hooks/usePasswordToggle";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaValidate } from "common/validationRules/validationRules";
import { getToken } from "config/axiosInstance";
import { loginApi } from "services/auth";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";

const LoginPage = () => {
  const navigate = useNavigate();

  // -----------------------react hook form

  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isValid, isDirty, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaValidate("login")),
    mode: "onChange", // IMPORTANT
    defaultValues: {
      userEmail: "",
      userPassword: "",
    },
  });

  const [inputType, icon] = usePasswordToggle();

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    console.log("dataInp:--->", dataInp);

    const payload = {
      email: dataInp?.userEmail,
      password: dataInp?.userPassword,
    };

    try {
      const response = await loginApi(payload);

      logger.log("data response:-->", response);

      if (response?.status === 200) {
        localStorage.setItem("naksha_admin", response?.data?.data?.token);
        localStorage.setItem(
          "naksha_admin-detail",
          JSON.stringify(response?.data?.data?.user)
        );
        toastMessage(response?.data?.message, "success");

        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error:--->", error);
    }
  };

  // -----------------------------to disable and enable button
  const isSubmitEnabled = isDirty && isValid;
  // && touchedFields.userEmail && touchedFields.userPassword;

  // --------if user is logged in then navoigfate to dashboard

  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <div className="auth_section">
        <Header />
        <div className="auth_content">
          <div className="image_section">
            <img src={loginImage} alt="login-image" />
          </div>
          <div className="content_right">
            <form onSubmit={handleSubmit(doSubmit)}>
              <div className="form_title">
                <p>Welcome back.</p>
                <h3>Log in to your account below.</h3>
              </div>
              <div className="content">
                <div className="form_field has_icon">
                  <img
                    src={emailIcon}
                    alt="email-icon"
                    className="input_icon"
                  />
                  <input
                    className="form-control input  false"
                    placeholder="Email address"
                    // name="email"
                    {...register("userEmail")}
                  />
                  {/* ------------for error message */}
                  {errors?.userEmail && (
                    <div className="validation_err">
                      <p>{errors?.userEmail?.message}</p>
                    </div>
                  )}
                </div>

                <div className="form_field has_icon password">
                  <img src={lockIcon} alt="" className="input_icon" />
                  <input
                    className="form-control input form-control input false"
                    type={inputType}
                    placeholder="Password"
                    // name="password"
                    {...register("userPassword")}
                  />

                  {/* <span
                    className="password_icons"
                    onClick={() => setShowPassword(!showPassword)} // 👈 toggle state
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  </span> */}
                  <span className="password_icons">{icon}</span>

                  {/* ---------------email validator */}
                  {errors?.userPassword && (
                    <div className="validation_err">
                      <p>{errors?.userPassword?.message}</p>
                    </div>
                  )}
                </div>

                <div className="reminder">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="button_wrap">
                  <button
                    type="submit"
                    className="w-100 button "
                    disabled={!isSubmitEnabled}
                  >
                    {isSubmitting && bootstrapLoaderHelperFun()}
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <DevTool control={control} /> */}
    </>
  );
};
export default LoginPage;
