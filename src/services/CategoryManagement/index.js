import {
  instance as axios,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const getCategoryListApi = async (data) => {
  const endPoint = `/api/v1/admin/category/list?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

// -------------------dleelt cat

export const deleteCategoryApi = async ({ id }) => {
  const endPoint = `/api/v1/admin/category/delete/${id}`;

  return await axios.delete(endPoint, setJwtToken());
};

// ---------add category

export const addCategoryApi = async (data) => {
  const endPoint = `/api/v1/admin/category/add`;

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
    return await axios.patch("/api/v1/admin/account/profile",data, setMultiPartHeader());
}

export const  profileDetailsData = async()=>{
    return await axios.get("/api/v1/admin/account/profile",setJwtToken());
}

