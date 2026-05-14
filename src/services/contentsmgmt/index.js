import {
  instance as axios,
  getToken,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";

export const ContentListApi = async (data) => {
  const endPoint = `api/admin/content/song/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};

export const deleteContanentApi = async (id) => {
  console.log(id);
  const endPoint = `api/admin/content/song/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};

export const contentArrayListApi = async (data) => {
  const endPoint = `api/admin/content/all_categories?${new URLSearchParams(
    data
  )}`;
  return await axios.get(endPoint, setJwtToken());
};

//  ------------add song=================================

export const addSongApi = async (data) => {
  const endPoint = `/api/admin/content/song/add-update`;
  return await axios.post(endPoint, data, setMultiPartHeader());
};


 export const getArtistNameListApi = async () => {
  const endPoint = `/api/admin/content/all_artists`;

  return await axios.get(endPoint, setJwtToken());
}

//===================PlayList =============================


export const addPlayListApi = async (data) => {
  const endPoint = `/api/admin/content/playlist/add-update`;
  return await axios.post(endPoint, data, setMultiPartHeader());
};
 

export const ContentPlayListApi = async (data) => {
  const endPoint = `api/admin/content/playlist/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};


export const deleteContanentPlayListApi = async (id) => {
  console.log(id);
  const endPoint = `api/admin/content/playlist/delete/${id}`;
  return await axios.delete(endPoint, setJwtToken());
};



//===================STORY =============================

export const ContentStoryListApi = async (data) => {
  const endPoint = `api/admin/content/story/list?${new URLSearchParams(data)}`;
  return await axios.get(endPoint, setJwtToken());
};


export const deleteContanentStoryApi = async (id) => {
  console.log(id);
  const endPoint = `api/admin/content/story/delete/${id}`;
  //faq/delete?faqId
  return await axios.delete(endPoint, setJwtToken());
};

 
// export const ContentSongListApi = async (data) => {
//   const endPoint = `api/admin/content/story/list?${new URLSearchParams(data)}`;
//   return await axios.get(endPoint, setJwtToken());
// };



export const songList = async (data) => {
  const endPoint = `api/admin/content/list`;
  return await axios.get(endPoint, setJwtToken());
};


 

