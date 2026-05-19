import {
  instance as axios,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";
import { dedupeRequest } from "../../utils/requestDedupe";

// User List

export const getBrandListApi = async (data) => {
  const queryString = new URLSearchParams(data).toString();
  const endPoint = `/api/v1/admin/brand/list?${queryString}`;

  return await dedupeRequest(endPoint, () => axios.get(endPoint, setJwtToken()));
};

export const changeStatusAPI = async (data) => {
  console.log(data, "changeStatusAPI");

  const endPoint = `/api/v1/admin/brand/change_status`;
  const payload = new FormData();

  payload.append("brandId", data?.brandId);
  payload.append("status", String(data?.status));

  return await axios.put(endPoint, payload, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};



// -------------------dleelt cat

export const deleteBrandApi = async ( id ) => {
  const endPoint = `/api/v1/admin/brand/delete/${id}`;

  return await axios.delete(endPoint, setJwtToken());
};

// ---------add category

export const addBrandApi = async (data) => {
  const endPoint = `/api/v1/admin/brand/add`;

  return await axios.post(endPoint, data, {
    ...setMultiPartHeader(),
    skipEncryption: true,
  });
};



// -------------------------------fetch data  this is contnent management of api

export const getAllCategoryOptionListApi = async (data) => {
  const endPoint = `/api/v1/admin/content/all_categories?${new URLSearchParams(
    data
  )}`;

  return await axios.get(endPoint, setJwtToken());
};

export const  profileUpdated = async(data)=>{
    return await axios.put("/api/v1/admin/account/profile",data, setMultiPartHeader());
}

export const  profileDetailsData = async()=>{
    return await axios.get("/api/v1/admin/account/profile",setJwtToken());
}
