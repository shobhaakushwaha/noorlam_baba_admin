import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
      richColors={true}
      theme="system"
      closeButton={true}
      className="custom_toast"
    />
  </StrictMode>
);
