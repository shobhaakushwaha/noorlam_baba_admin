import { instance as axios } from "../../config/axiosInstance";

// ---------------------login----------------------------------
export const loginApi = async (data) => {
  return await axios.post("/api/v1/admin/auth/login", data);
};

export const forgotPassApi = async (data) => {
  return await axios.post("/api/v1/admin/auth/forgot_password", data);
};

// -----------otp verify rule

export const otpVerifyApi = async (data) => {
  return await axios.post("/api/admin/v1/auth/forgot_password", data);
};

// -----------------reset password
export const resetPassPassApi = async (data) => {
  return await axios.post("/api/v1/admin/auth/reset_password", data);
};
