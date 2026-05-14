import React, { useEffect, useState } from "react";
import { messageIconBg } from "assets/icons";
import { loginImage } from "assets/images";
import { Header } from "components/header/Header";

import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "config/axiosInstance";
import { logger } from "utils/logger";
import { forgotPassApi } from "services/auth";
import { toastMessage } from "utils/toastMessage";
import { useTemporaryDisable } from "hooks/useTemporaryDisable";

const Otp = () => {
  const [tagRef, disableTag] = useTemporaryDisable(6000);

  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState();

  logger.log("otp:-->", otp);

  // ---------------setting user email id

  useEffect(() => {
    if (location?.state?.nakshaUserEmail) {
      localStorage.setItem("nakshaUserEmail", location?.state?.nakshaUserEmail);
    }
  }, []);

  // ---------if present then it will fetch email
  const nakshaUserEmail = localStorage.getItem("nakshaUserEmail");

  // ---------------------------to login if logged in
  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard");
    }
  }, []);

  // -------------------------------------doVerifyOtpFun
  const doVerifyOtpFun = async () => {
    try {
    } catch (error) {
      console.log("Otp verify error", error);
    }
  };

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

  return (
    <>
      <div className="auth_section">
        <Header />
        <div className="auth_content">
          <div className="image_section">
            <img src={loginImage} alt="login-image" />
          </div>
          <div className="content_right">
            <form className="fix_width">
              <div className="form_title">
                <div className="lock_icon">
                  <img src={messageIconBg} alt="icon" />
                </div>
                <h3>We’ve Sent You a Code</h3>
                <p className="light_color">
                  Please enter the code we sent you below
                </p>
              </div>
              <div className="otp_wraps">
                <OtpInput
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
                  {/* <Link
                  
                    onClick={(e) => {
                      e.preventDefault();
                      doSubmitForm();
                    }}
                  >
                    Resend code
                  </Link> */}
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

              <div className="button_wrap button_right">
                <button
                  type="button"
                  className="button button w-100"
                  onClick={doVerifyOtpFun}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Otp;
