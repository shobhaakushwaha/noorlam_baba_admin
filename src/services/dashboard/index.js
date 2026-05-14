import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";

// export const dashboardListApi = async (data) => {
//   const endPoint = `api/admin/dashboard`;
//   return await axios.get(endPoint, setJwtToken());
// };
export const dashboardListApi = async (data) => {
  const endPoint = `/api/admin/dashboard/?${new URLSearchParams(data)}`;
   return await axios.get(endPoint, setJwtToken());
};


export const deleteContanentApi = async (id) => {
  console.log(id);
  const endPoint = `api/admin/content/song/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};


export const getDashboardTrending = async (data) => {
  const endPoint = `/api/admin/dashboard/trending?${new URLSearchParams(data)}`;
   return await axios.get(endPoint, setJwtToken());
};






export const getGraphData = async (data) => {
    console.log()
  const endPoint = `api/admin/analytics/trends?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};


 export  const dashboardGrowth  = async(data) =>{
   
  const endPoint = `api/admin/dashboard/growth`;
  return await axios.get(endPoint, setJwtToken());

 }