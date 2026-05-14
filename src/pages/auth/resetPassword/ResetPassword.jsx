import React, { useEffect, useState } from "react";
import { loginImage } from "assets/images";
import { Header } from "components/header/Header";
import { IoMdEyeOff } from "react-icons/io";
import { lockIcon, lockIconUpdate } from "assets/icons";
import OTPInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "config/axiosInstance";
import { useTemporaryDisable } from "hooks/useTemporaryDisable";
import { forgotPassApi, resetPassPassApi } from "services/auth";
import { toastMessage } from "utils/toastMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaValidate } from "common/validationRules/validationRules";
import { useForm } from "react-hook-form";
import usePasswordToggle from "hooks/usePasswordToggle";
import { logger } from "utils/logger";

const ResetPassword = () => {
  const [inputType, icon] = usePasswordToggle();
  const [confirmInputType, confirmPassicon] = usePasswordToggle();

  // ------------------------------zod and  react-hook-form part
  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaValidate("setNewPassword")),
    mode: "onChange", // IMPORTANT
  });

  // ---------------------------usestate aprt
  const [otp, setOtp] = useState();
  logger.log("otp", otp);
  const [tagRef, disableTag] = useTemporaryDisable(6000);

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------setting user email id

  useEffect(() => {
    if (location?.state?.nakshaUserEmail) {
      localStorage.setItem("nakshaUserEmail", location?.state?.nakshaUserEmail);
    }
  }, []);

  // ---------if present then it will fetch email
  // const nakshaUserEmail = localStorage.getItem("nakshaUserEmail");

  const userEmail =
    location?.state?.nakshaUserEmail || localStorage.getItem("nakshaUserEmail")
      ? location?.state?.nakshaUserEmail ||
        localStorage.getItem("nakshaUserEmail")
      : "";

  const doSubmitForm = async () => {
    if (!userEmail) {
      console.log("No email stored");
      return;
    }

    try {
      const res = await forgotPassApi({ email: userEmail });

      if (res?.data?.status === 200) {
        toastMessage(res?.data?.message, "success");
      }
    } catch (error) {
      console.log("error while forgot password:-->", error);
    } finally {
      // setButtonLogger(false);
    }
  };

  // ---------------------------to login if logged in
  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard");
    }
  }, []);

  // ----------------------------submit for success

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    console.log("dataInp:--->", dataInp);

    const payload = {
      newPassword: dataInp?.userPassword,
      confirmPassword: dataInp?.confirmPass,
      email: userEmail,
      otp: otp,
    };

    try {
      const response = await resetPassPassApi(payload);

      logger.log("data response:-->", response);

      if (response?.status === 200) {
        localStorage.removeItem("nakshaUserEmail");

        toastMessage(response?.data?.message, "success");

        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error:--->", error);
    }
  };

  const isSubmitEnabled = isDirty && isValid;

  return (
    <>
      <div className="auth_section">
        <Header />
        <div className="auth_content">
          <div className="image_section">
            <img src={loginImage} alt="login-image" />
          </div>
          <div className="content_right reset_password_content_right">
            <form onSubmit={handleSubmit(doSubmit)}>
              <div className="form_title">
                <div className="lock_icon">
                  <img src={lockIconUpdate} alt="icon" />
                </div>
                <h3>Set a new password</h3>
                {/* <p className="light_color">Please enter the new password</p> */}

                <p className="light_color">
                  Please enter the code we sent you below
                </p>
              </div>

              {/* ----------otp */}
              <div className="otp_wraps">
                <OTPInput
                  value={otp}
                  inputType="number"
                  onChange={setOtp}
                  numInputs={4}
                  renderInput={(props) => <input {...props} />}
                />
              </div>

              <div className="regenrate_otp">
                <span>
                  Didn’t received the code?{" "}
                  <Link
                    ref={tagRef}
                    onClick={(e) => {
                      e.preventDefault();
                      disableTag();
                      doSubmitForm();
                    }}
                  >
                    Resend code
                  </Link>
                </span>
              </div>

              <div className="form_title password_tittle">
                {/* <h3>Set a new password</h3> */}
                <p className="light_color">Please Set the new password</p>
              </div>

              <div className="form_field has_icon password mb-4">
                <img src={lockIcon} alt="email-icon" className="input_icon" />
                <input
                  className="form-control input  false"
                  placeholder="Password"
                  // type="password"
                  type={inputType}
                  // name="newPassword"
                  {...register("userPassword")}
                />
                <span className="password_icons">{icon}</span>

                {/* ------------for error message */}
                {errors?.userPassword && (
                  <div className="validation_err">
                    <p>{errors?.userPassword?.message}</p>
                  </div>
                )}
              </div>
              <div className="form_field has_icon password ">
                <img src={lockIcon} alt="email-icon" className="input_icon" />
                <input
                  className="form-control input  false"
                  placeholder="Confirm Password"
                  type={confirmInputType}
                  // name="confirmPassword"
                  {...register("confirmPass")}
                />

                <span className="password_icons">{confirmPassicon}</span>

                {/* ------------for error message */}
                {errors?.confirmPass && (
                  <div className="validation_err">
                    <p>{errors?.confirmPass?.message}</p>
                  </div>
                )}
              </div>
              {/* <div className="pass_charter">
                <p>
                  Min. 8 characters including an upper and lowercase letter,
                  digit and a symbol.
                </p>
              </div> */}
              <div className="button_wrap button_right">
                <button
                  type="submit"
                  disabled={!isSubmitEnabled || !otp || otp?.length < 4}
                  className="button button w-100"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

// -------------------------------------------old code

// import React from "react";
// import { loginImage } from "assets/images";
// import { Header } from "components/header/Header";
// import { IoMdEyeOff } from "react-icons/io";
// import { lockIcon, lockIconUpdate } from "assets/icons";

// const ResetPassword = () => {

//   return (
//     <>
//       <div className="auth_section">
//         <Header />
//         <div className="auth_content">
//           <div className="image_section">
//             <img src={loginImage} alt="login-image" />
//           </div>
//           <div className="content_right">
//             <form>
//               <div className="form_title">
//                 <div className="lock_icon">
//                   <img src={lockIconUpdate} alt="icon" />
//                 </div>
//                 <h3>Set a new password</h3>
//                 <p className="light_color">Please enter the new password</p>
//               </div>

//               <div className="form_field has_icon password mb-4">
//                 <img src={lockIcon} alt="email-icon" className="input_icon" />
//                 <input
//                   className="form-control input  false"
//                   placeholder="Password"
//                   type="password"
//                   name="newPassword"

//                 />
//                 <span className="password_icons">
//                   <IoMdEyeOff />
//                 </span>
//               </div>
//               <div className="form_field has_icon password ">
//                 <img src={lockIcon} alt="email-icon" className="input_icon" />
//                 <input
//                   className="form-control input  false"
//                   placeholder="Confirm Password"
//                   type="password"
//                   name="confirmPassword"

//                 />

//                 <span className="password_icons">
//                   <IoMdEyeOff />
//                 </span>
//               </div>
//               {/* <div className="pass_charter">
//                 <p>
//                   Min. 8 characters including an upper and lowercase letter,
//                   digit and a symbol.
//                 </p>
//               </div> */}
//               <div className="button_wrap button_right">
//                 <button
//                   type="button"
//                   className="button button w-100"

//                 >
//                   Reset Password
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResetPassword;
