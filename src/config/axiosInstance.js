// Putting logout because of no activity
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "utils/toastMessage";
 
// -===-------------for encryption
import {
  decryptData,
  encryptData,
  isEncryptionEnabled,
  queryStringToJSON,
} from "./encryption";
 
// this code is created an instance with base url for admin
// const url =
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
 
export const getToken = () => {
  const nakshaAdminInfo = localStorage.getItem("naksha_admin");
  // console.log("nakshaAdminInfo token", nakshaAdminInfo);
  return nakshaAdminInfo ? nakshaAdminInfo : null;
};
 
export const setJwtToken = () => {
  const token = getToken();
 
  if (!token) {
    console.error("Token is missing or invalid");
    return {};
  }
 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};
 
export const setMultiPartHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
};
 
export const removeToken = () => {
  const keys = [
    "naksha_admin",
    "naksha_admin-detail",
    "naksha_admin-permission",
  ];
  keys.forEach((key) => localStorage.removeItem(key));
};

const isFormData = (value) =>
  typeof FormData !== "undefined" && value instanceof FormData;

const isFileLike = (value) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob);

const getHeaderValue = (headers, key) => {
  if (!headers) return "";
  if (typeof headers.get === "function") {
    return headers.get(key) || "";
  }

  return headers[key] || headers[key.toLowerCase()] || "";
};

const setHeaderValue = (headers, key, value) => {
  if (!headers) return;
  if (typeof headers.set === "function") {
    headers.set(key, value);
    return;
  }

  headers[key] = value;
};

const isMultipartRequest = (config) =>
  getHeaderValue(config.headers, "Content-Type")
    ?.toLowerCase()
    .includes("multipart/form-data");

const getEncryptedPayload = (data) => {
  if (typeof data?.reqData === "string") return data.reqData;
  if (typeof data?.payload === "string") return data.payload;
  if (typeof data?.data === "string") return data.data;
  return null;
};

const addToken = (data = {}) => {
  const token = getToken() || data?.token;
  return {
    ...data,
    ...(token ? { token } : {}),
  };
};

const encryptQueryRequest = (config) => {
  const urlParts = config.url?.split("?") || [];
  const baseUrl = urlParts[0];
  const queryParams = queryStringToJSON(urlParts[1]);
  const configParams = config.params || {};
  const bodyData =
    config.data && typeof config.data === "object" && !isFormData(config.data)
      ? config.data
      : {};

  config.url = baseUrl;
  config.params = {
    reqData: encryptData(
      addToken({ ...queryParams, ...configParams, ...bodyData }),
    ),
  };
  delete config.data;
};

const encryptBodyRequest = (config) => {
  const data = config.data || {};

  if (isMultipartRequest(config) && isFormData(data)) {
    const encryptedFormData = new FormData();
    const textData = {};

    data.forEach((value, key) => {
      if (isFileLike(value)) {
        encryptedFormData.append(key, value);
      } else {
        textData[key] = value;
      }
    });

    encryptedFormData.append("payload", encryptData(addToken(textData)));
    config.data = encryptedFormData;
    return;
  }

  config.data = {
    reqData: encryptData(addToken(data)),
  };
  setHeaderValue(config.headers, "Content-Type", "application/json");
};

const encryptRequest = (config) => {
  if (!isEncryptionEnabled) return config;

  const method = config.method?.toLowerCase();
  if (["get", "delete"].includes(method)) {
    encryptQueryRequest(config);
    return config;
  }

  if (["post", "put", "patch"].includes(method)) {
    encryptBodyRequest(config);
  }

  return config;
};

const normalizeEncryptedResponse = (data) => {
  if (!isEncryptionEnabled) return data;

  const encryptedPayload = getEncryptedPayload(data);
  if (!encryptedPayload) return data;

  const decryptedData = decryptData(encryptedPayload);
  return decryptedData?.response || decryptedData || data;
};
 
 
export const AxiosInterceptor = ({ children }) => {
  const [isSet, setIsSet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = (response) => {
      const finalResponse = normalizeEncryptedResponse(response?.data);
 
      if (finalResponse?.status == 502 || finalResponse?.status === 502) {
        console.log("Server Down: resInterceptor");
      }
 
      if (
        finalResponse?.status === 401 ||
        finalResponse?.status === 419 ||
        // finalResponse.status === 422 ||
        finalResponse?.status === 403
      ) {
        removeToken();
        navigate("/");
      }

      if (finalResponse) {
        response.data = finalResponse;
      }

      return response;
    };

    const errInterceptor = (error) => {
      if (!error?.response) {
        toastMessage(
          "Connection error. Please check your network or server.",
          "error",
          "networkError",
        );
        return Promise.reject(error);
      }

      const res = normalizeEncryptedResponse(error?.response?.data);
      toastMessage(res?.message || res?.data?.message || error.message, "error");
 
      // toast.error(error?.response?.data?.message);
 
      console.log("res---->", res);
 
      if (res?.status == 502 || res?.status === 502) {
        console.log("Server Down");
      }
 
      if (res?.status == 403 || res?.status == 401) {
        //|| res.status == 422
        removeToken();
        navigate("/");
      }

      if (error.response && res) {
        error.response.data = res;
      }

      return Promise.reject(error);
    };
 
    const requestInterceptor = instance.interceptors.request.use(encryptRequest);
 
    const responseInterceptor = instance.interceptors.response.use(
      resInterceptor,
      errInterceptor,
    );
    setIsSet(true);
 
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
    // eslint-disable-next-line
  }, []);
  return isSet && children;
};
 
 
