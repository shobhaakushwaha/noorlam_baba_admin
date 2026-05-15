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
  const payload = new FormData();

  Object.entries(data || {}).forEach(([key, value]) => {
    payload.append(key, value ?? "");
  });

  return await axios.post(
    "api/v1/admin/notification/add",
    payload,
    {
      ...setMultiPartHeader(),
      skipEncryption: true,
    },
  );
};
export const deleteNotificationApi = async (id) => {
  const endPoint = `/api/v1/admin/notification/delete/${id}`;
  return await axios.delete(endPoint, setJwtToken());
};
