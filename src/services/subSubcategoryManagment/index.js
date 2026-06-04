import {
  instance as axios,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";
import { dedupeRequest } from "../../utils/requestDedupe";

export const getSubSubcategoryListApi = async (data) => {
  const queryString = new URLSearchParams(data).toString();
  const endPoint = `/api/v1/admin/sub-subcategory/list?${queryString}`;

  return await dedupeRequest(endPoint, () => axios.get(endPoint, setJwtToken()));
};

export const addSubSubcategoryApi = async (data) => {
  return await axios.post("/api/v1/admin/sub-subcategory/add", data, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};

export const changeSubSubcategoryStatusApi = async (data) => {
  const endPoint = `/api/v1/admin/sub-subcategory/change_status`;
  const payload = new FormData();

  payload.append("subSubCategoryId", data?.subSubCategoryId);
  payload.append("status", String(data?.status));

  return await axios.put(endPoint, payload, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};

export const deleteSubSubcategoryApi = async (id) => {
  const endPoint = `/api/v1/admin/sub-subcategory/delete/${id}`;

  return await axios.delete(endPoint, setJwtToken());
};
