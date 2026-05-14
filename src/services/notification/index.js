import { logger } from "utils/logger";
import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";


export const getNotificationListApi = async (data) => {
  const endPoint = `/api/v1/admin/notification/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};


export const addNotificationApi = async (data) => {
  console.log(data, " update ");
  return await axios.post(
    "api/v1/admin/notification/send",
    data,
    setMultiPartHeader(),
  );
};



export const deleteNotificationApi = async (payload) => {
  const endPoint = `/api/v1/admin/notification/delete`;

  return await axios.delete(endPoint, {
    data: payload,
    ...setJwtToken(),
  });
};

