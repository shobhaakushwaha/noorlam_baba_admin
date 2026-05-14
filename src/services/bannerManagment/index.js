import { logger } from "utils/logger";
import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const getBannerListApi = async (data) => {
  const endPoint = `/api/v1/admin/banner/list?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

export const editBannerApi = async (data) => {
  const endPoint = `/api/admin/cms/update-cms`;

  return await axios.put(endPoint, data, setJwtToken());
};

export const addBannertApi = async (data) => {
  console.log(data, " update ");
  return await axios.post("api/admin/banner/add", data, setMultiPartHeader());
};

export const changeStatusAPI = async (data) => {
  console.log(data, "changeStatusAPI");

  const endPoint = `api/admin/banner/status/${data.userId}`;

  return axios.put(
    endPoint,
    { status: data.status }, // 👈 must be an object
    setJwtToken()
  );
};



export const deleteBannerApi = async (id) => {
   console.log(id)
  const endPoint = `/api/admin/banner/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};

