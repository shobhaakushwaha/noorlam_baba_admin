import { Loader } from "../components/loader/Loader";
import React, { Fragment, useState } from "react";

const useFullPageLoader = () => {
  const [loader, setLoader] = useState(false);

  const onShow = () => {
    setLoader(true);
  };

  const onHide = () => {
    setLoader(false);
  };

  return [loader ? <Loader /> : null, onShow, onHide];
};

export default useFullPageLoader;
