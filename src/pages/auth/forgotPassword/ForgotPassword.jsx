import React, { useEffect } from "react";
import { emailIcon } from "assets/icons";
import { loginImage } from "assets/images";
import { Header } from "components/header/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemaValidate } from "common/validationRules/validationRules";
import { getToken } from "config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { logger } from "utils/logger";
import { forgotPassApi } from "services/auth";
import { toastMessage } from "utils/toastMessage";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  // ----navigate
  const navigate = useNavigate();

  // -----------------------useButtonLoader

  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaValidate("forgotPassword")),
    mode: "onChange", // IMPORTANT
  });

  const doSubmitForm = async (data) => {
    console.log("data:--->", data);
    // setButtonLogger(true);
    try {
      const res = await forgotPassApi({ email: data?.userEmail });

      logger.log("res:--", res);

      if (res?.data?.status === 200) {
        toastMessage(res?.data?.message, "success");
        logger.log("/reset-password route");

        navigate("/reset-password", {
          state: { nakshaUserEmail: data?.userEmail },
        });
      }
    } catch (error) {
      console.log("error while forgot password:-->", error);
    } finally {
      // setButtonLogger(false);
    }
  };

  // -------to disable button
  const isSubmitEnabled = isDirty && isValid;
  logger.log("isSubmitEnabled:--->", isSubmitEnabled);

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
            <form onSubmit={handleSubmit(doSubmitForm)}>
              <IoArrowBack
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/");
                }}
              />
              <div className="form_title">
                <p>Welcome back.</p>
                <h3>Forgot Password?</h3>
              </div>
              <div className="form_field has_icon">
                <img src={emailIcon} alt="email-icon" className="input_icon" />
                <input
                  className="form-control input  false"
                  placeholder="Enter your email address"
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
              <div className="button_wrap button_right">
                <button
                  // ref={buttonLogger}
                  type="submit"
                  className="button button w-100"
                  disabled={!isSubmitEnabled || isSubmitting}
                >
                  {isSubmitting && bootstrapLoaderHelperFun()}
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
