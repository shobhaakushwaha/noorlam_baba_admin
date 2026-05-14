import { logger } from "utils/logger";
import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
  // setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const getCategoryListApi = async (data) => {
  const endPoint = `/api/admin/category/list?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

// -------------------dleelt cat

export const deleteCategoryApi = async ({ id }) => {
  const endPoint = `/api/admin/category/delete/${id}`;

  return await axios.delete(endPoint, setJwtToken());
};

// ---------add category

export const addCategoryApi = async (data) => {
  const endPoint = `/api/admin/category/add`;

  return await axios.post(endPoint, data, setMultiPartHeader());
};

// -----edit category

export const editCategoryApi = async ({ id, data }) => {
  const endPoint = `/api/admin/category/update/${id}`;

  return await axios.put(endPoint, data, setMultiPartHeader());
};

// -------------------------------fetch data  this is contnent management of api

export const getAllCategoryOptionListApi = async (data) => {
  const endPoint = `/api/admin/content/all_categories?${new URLSearchParams(
    data
  )}`;

  return await axios.get(endPoint, setJwtToken());
};

export const  profileUpdated = async(data)=>{
    return await axios.patch("/api/admin/account/profile",data, setMultiPartHeader());
}

export const  profileDetailsData = async()=>{
    return await axios.get("/api/admin/account/profile",setJwtToken());
}


