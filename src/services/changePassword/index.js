import {
  instance as axios,
  getToken,
  setJwtToken,
  // setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const changePasswordApi = async (data) => {
  const endPoint = `/api/v1/admin/account/change-password`;

  return await axios.post(endPoint, data, setJwtToken());
};
