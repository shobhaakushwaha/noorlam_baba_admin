import { zodResolver } from "@hookform/resolvers/zod";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { schemaValidate } from "common/validationRules/validationRules";
import { removeToken } from "config/axiosInstance";
import usePasswordToggle from "hooks/usePasswordToggle";
import React from "react";
import { useForm } from "react-hook-form";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { changePasswordApi } from "services/changePassword";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [inputType, icon] = usePasswordToggle();
  const [newPassType, newPassicon] = usePasswordToggle();
  const [confirmPass, confirmPassicon] = usePasswordToggle();

  // -----------------------react hook form

  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isValid, isDirty, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaValidate("changePass")),
    mode: "onChange", // IMPORTANT
  });

  const isSubmitEnabled = isDirty && isValid;

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    console.log("dataInp:--->", dataInp);

    const payload = {
      oldPassword: dataInp.oldPassword,
      newPassword: dataInp?.currentPassword,
      confirmPassword: dataInp?.confirmPass,
    };

    try {
      const response = await changePasswordApi(payload);

      logger.log("data response:-->", response);

      if (response?.status === 200) {
        toastMessage(response?.data?.message, "success");
        removeToken();
        navigate("/");
      }
    } catch (error) {
      console.log("error:--->", error);
    }
  };

  return (
    <>
      <div className="change_pass full-width">
        <div className="dashboard_title">
          <h3>Change Password</h3>
        </div>
        <div className="card">
          <div className="form_details">
            <form onSubmit={handleSubmit(doSubmit)}>
              <div className="content">
                <div className="form_field has_icon password">
                  <label className="label"> Old Password</label>
                  <input
                    className="form-control input form-control input false"
                    type={inputType}
                    placeholder="Enter Old Password"
                    {...register("oldPassword")}
                  />
                  <span className="password_icons">{icon}</span>

                  {/* ------------for error message */}
                  {errors?.oldPassword && (
                    <div className="validation_err">
                      <p>{errors?.oldPassword?.message}</p>
                    </div>
                  )}
                </div>
                <div className="form_field has_icon password">
                  <label className="label"> New Password</label>
                  <input
                    className="form-control input form-control input false"
                    type={newPassType}
                    placeholder="Enter New Password"
                    {...register("currentPassword")}
                  />
                  <span className="password_icons">{newPassicon}</span>
                  {/* ------------for error message */}

                  {errors?.currentPassword && (
                    <div className="validation_err">
                      <p>{errors?.currentPassword?.message}</p>
                    </div>
                  )}
                </div>
                <div className="form_field has_icon password">
                  <label className="label"> Confirm Password</label>
                  <input
                    className="form-control input form-control input false"
                    type={confirmPass}
                    placeholder="Enter Confirm Password"
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

                <div className="button_wrap">
                  <button
                    type="submit"
                    className="button"
                    disabled={!isSubmitEnabled || isSubmitting}
                  >
                    {isSubmitting && bootstrapLoaderHelperFun()}
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
