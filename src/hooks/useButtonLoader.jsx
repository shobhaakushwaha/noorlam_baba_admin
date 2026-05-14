import { useRef, useState, useEffect } from "react";

const useButtonLoader = (defaultText) => {
  const [isLoading, setLoading] = useState(false);
  const element = useRef(null);

  useEffect(() => {
    if (isLoading && element.current) {
      element.current.disabled = true;
      element.current.innerHTML = `<div class="btn_loadings">
      <span>
        <b></b>
        <b></b>
        <b></b>
        <b></b>
      </span>
    </div>`;
    } else {
      if (element.current) {
        element.current.disabled = false;
        element.current.innerHTML = defaultText;
      }
    }
  }, [isLoading]);
  return [element, setLoading];
};
export default useButtonLoader;
