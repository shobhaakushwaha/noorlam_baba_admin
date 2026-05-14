import { logger } from "utils/logger";
import {
  instance as axios,
  setJwtToken,
  setMultiPartHeader,
} from "../../config/axiosInstance";

// User List

// -----------------cms api

export const getCmsContentListApi = async (data) => {
  const endPoint = `/api/v1/admin/cms/list?${new URLSearchParams(data)}`;

  return await axios.get(endPoint, setJwtToken());
};

export const editCmsContentApi = async (data) => {
  const endPoint = `/api/v1/admin/cms/add`;
  const reqData = data instanceof FormData ? data : new FormData();

  if (!(data instanceof FormData)) {
    Object.entries(data || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        reqData.append(key, value);
      }
    });
  }

  return await axios.post(endPoint, reqData, setMultiPartHeader());
};

// ---------------------------------------add contennt
