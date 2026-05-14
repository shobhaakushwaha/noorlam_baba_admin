import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import Routing from "./routing/Routing";
import ScrollToTop from "./routing/ScrollToTop";
import { AxiosInterceptor } from "config/axiosInstance";
// import { Toaster } from 'react-hot-toast';

function App() {
  const baseName = import.meta.env.VITE_BASE_PATH;
  return (
    <>
      <BrowserRouter basename={baseName}>
        <AxiosInterceptor>
          <ScrollToTop />
          {/* <Toaster /> */}
          <Routing />
        </AxiosInterceptor>
      </BrowserRouter>
    </>
  );
}

export default App;
