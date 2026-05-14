// ------------------------------------------new check

// import { io } from "socket.io-client";
// import { getToken } from "../config/axiosInstance";

// const URL = import.meta.env.VITE_BAAJUU_SERVER;

// // Create socket without initial auth
// const socket = io(URL, {
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: 10,
//   transports: ["websocket"],
// });

// // ------------Function to get fresh token when needed
// const getAuthToken = () => {
//   const token = getToken();
//   // console.log("🔑 Current token:", token);
//   return token;
// };

// // ------------------ authentication before connecting
// socket.on("connect", () => {
//   console.log("🔌 [SOCKET] Connected to server");
//   // You can emit authentication here if needed
//   const token = getAuthToken();
//   if (token) {
//     socket.emit("authenticate", { token });
//   }
// });

// socket.on("disconnect", (reason) => {
//   console.log("🔌 [SOCKET] Disconnected:", reason);
// });

// socket.on("connect_error", (error) => {
//   console.log("🔌 [SOCKET] Connection error:", error);
//   // -----------------Update auth and retry if it's an auth error
//   if (error.message?.includes("auth") || error.message?.includes("token")) {
//     console.log("🔄 Updating authentication and retrying...");
//     socket.auth.token = getAuthToken();
//   }
// });

// // -----------------Override connect to always use fresh token
// const originalConnect = socket.connect;
// socket.connect = function () {
//   // ------------Always get fresh token before connecting
//   const token = getAuthToken();
//   this.auth = {
//     token: token,
//     type: "admin",
//     timezone: "Asia/Kolkata",
//   };
//   console.log("🚀 Connecting with auth:", this.auth);
//   return originalConnect.call(this);
// };

// export default socket;

import { io } from "socket.io-client";

import { getToken } from "../config/axiosInstance";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const gotAuthToken = () => getToken();

const socket = io(baseURL, {
  autoConnect: false, // Don't auto-connect without authentication

  reconnection: true,

  reconnectionAttempts: 10,

  transports: ["websocket"],

  // --- FIX PING TIMEOUT ---

  pingTimeout: 60000, // disconnect only after 60s

  pingInterval: 25000, // ping server every 25s

  timeout: 60000, // initial connection timeout
});

// override connect (fresh token)

const originalConnect = socket.connect;

socket.connect = function () {
  this.auth = {
    token: gotAuthToken(),

    type: "admin",

    timezone: "Asia/Kolkata",
  };

  return originalConnect.call(this);
};

socket.on("connect", () => {
  // Socket connected successfully
});

socket.on("disconnect", () => {
  // Socket disconnected
});

socket.on("connect_error", (error) => {
  if (error.message.includes("auth") || error.message.includes("token")) {
    socket.auth.token = gotAuthToken();
  }
});

export default socket;
