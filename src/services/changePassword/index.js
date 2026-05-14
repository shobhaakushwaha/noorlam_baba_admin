import {
  instance as axios,
  getToken,
  setJwtToken,
  // setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const changePasswordApi = async (data) => {
  const endPoint = `/api/admin/account/update_password`;

  return await axios.patch(endPoint, data, setJwtToken());
};
