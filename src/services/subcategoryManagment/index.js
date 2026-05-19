import { logger } from "utils/logger";
import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";
import { dedupeRequest } from "../../utils/requestDedupe";

// User List

export const getSubcategoryListApi = async (data) => {
  const queryString = new URLSearchParams(data).toString();
  const endPoint = `/api/v1/admin/subcategory/list?${queryString}`;

  return await dedupeRequest(endPoint, () => axios.get(endPoint, setJwtToken()));
};

export const editSubcategoryApi = async (data) => {
  const endPoint = `/api/v1/admin/subcategory/add`;

  return await axios.put(endPoint, data, setJwtToken());
};

export const addSubcategoryApi = async (data) => {
  console.log(data, " update ");
  return await axios.post("/api/v1/admin/subcategory/add", data, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};

export const changeStatusAPI = async (data) => {
  console.log(data, "changeStatusAPI");

  const endPoint = `/api/v1/admin/subcategory/change_status`;
  const payload = new FormData();

  payload.append("subcategoryId", data?.subcategoryId);
  payload.append("status", String(data?.status));

  return await axios.put(endPoint, payload, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};



export const deleteSubcategoryApi = async (id) => {
   console.log(id)
  const endPoint = `/api/v1/admin/subcategory/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};



