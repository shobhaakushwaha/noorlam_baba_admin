import {
  instance as axios,
  getToken,
  setJwtToken,
} from "../../config/axiosInstance";

export const FaqListApi = async (data) => {
  const endPoint = `/api/v1/admin/faq/list`;
  return await axios.get(endPoint, {
    ...setJwtToken(),
    params: data,
  });
};
export const addFaqApi = async (data) => {
  const endPoint = `/api/v1/admin/faq/add`;

  return await axios.post(endPoint, data, {
    ...setJwtToken(),
    skipEncryption: true,
  });
};





export const supportListApi = async (data) => {
  const endPoint = `/api/v1/admin/support/list`;
  return await axios.get(endPoint, {
    ...setJwtToken(),
    params: data,
  });
};

// export const supportApi = async (data) => {
//     console.log(data,"lll")
//   const endPoint = `api/admin/support/update-status`;

//   return await axios.patch(
//     endPoint,
//     {data}, // PUT requires a body (empty is fine)
//     setJwtToken() // headers
//   );
// };

export const supportApi = async (data) => {
  console.log(data, "payload");

  const endPoint = `/api/v1/admin/support/update-status`;

  return axios.patch(
    endPoint,
    data,              
    setJwtToken()
  );
};




export const deleteFaqApi = async (id) => {
   console.log(id)
  const endPoint = `/api/v1/admin/faq/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};
