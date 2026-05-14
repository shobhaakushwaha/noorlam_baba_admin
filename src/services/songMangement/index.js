import {
  instance as axios,
  getToken,
  setJwtToken,
  // setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

export const getSongListApi = async (data) => {
  const endPoint = `/api/admin/song/list?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

// -----------song mananagement || Requests Details

export const songManagementRequestDetailsApi = async (data) => {
  const endPoint = `/api/admin/song/detail/${data?.songId}`;

  return await axios.get(endPoint, setJwtToken());
};

export const acceptRejectSongReqApi = async (data) => {
  const endPoint = `/api/admin/song/update-status`;

  return await axios.patch(endPoint, data, setJwtToken());
};


export const deleteSongApi = async (id) => {
   console.log(id)
  const endPoint = `/api/admin/song/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};
