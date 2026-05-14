import {
  instance as axios,
  getToken,
  setJwtToken,
} from "../../config/axiosInstance";

export const ContentListApi = async (data) => {
  const endPoint = `api/v1/admin/content/song/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};

export const addFaqApi = async (data) => {
  const endPoint = `api/v1/admin/faq/add-update`;

  return await axios.post(
    endPoint,
    data,
    setJwtToken() // headers
  );
};





export const artistListApi = async (data) => {
  const endPoint = `api/v1/admin/support/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};


export const supportApi = async (data) => {
  console.log(data, "payload");

  const endPoint = `api/v1/admin/support/update-status`;

  return axios.patch(
    endPoint,
    data,              
    setJwtToken()
  );
};




export const deleteContanentApi = async (id) => {
   console.log(id)
  const endPoint = `api/admin/content/song/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};
