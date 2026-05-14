import {
  instance as axios,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";


export const getUserListApi = async (data) => {
  const endPoint = `/api/v1/admin/user/list?${new URLSearchParams(data)}`;
 return await axios.get(endPoint, setJwtToken());
};

// --------statsu

export const updateUserStatusApi = async (data) => {
  const endPoint = `/api/v1/admin/user/change_status`;
  const payload = data instanceof FormData ? data : new FormData();

  if (!(data instanceof FormData)) {
    Object.entries(data || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, value);
      }
    });
  }

  return await axios.put(endPoint, payload, setMultiPartHeader());
};

// ------------- details

export const getUserdetailsApi = async (data) => {
  const endPoint = `/api/admin/v1/user/detail?${new URLSearchParams(data)}`;
   return await axios.get(endPoint, setJwtToken());
};

export const getSongdetailsApi = async (data) => {
  const endPoint = `/api/v1/admin/user/uploaded-songs?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};

export const getUserPopularApi = async (data) => {
  const endPoint = `/api/v1/admin/user/popular-songs?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};

export const deleteUserApi = async (data) => {
  const userId = typeof data === "string" ? data : data?.id || data?.userId;
  const endPoint = `/api/v1/admin/user/delete/${userId}`;
  return await axios.delete(endPoint, setJwtToken());
};

//create  song List
export const getUserstoryApi = async (data) => {
  const endPoint = `/api/admin/user/story?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};

export const getUsersFollowApi = async (data) => {
  const endPoint = `/api/v1/admin/user/followed-artist?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

export const getUsersSaveListApi = async (data) => {
  const endPoint = `/api/v1/admin/user/playlists?${new URLSearchParams(data)}`;
   return await axios.get(endPoint, setJwtToken());
};

export const viewPlayListApi = async (data) => {
  const endPoint = `/api/v1/admin/user/view-playlist?${new URLSearchParams(data)}`;
   return await axios.get(endPoint, setJwtToken());
};
