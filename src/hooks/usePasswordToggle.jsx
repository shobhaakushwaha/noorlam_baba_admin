import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const Icon = visible ? (
    <IoEyeOutline onClick={() => setVisible((visible) => !visible)} />
  ) : (
    <IoEyeOffOutline onClick={() => setVisible((visible) => !visible)} />
  );

  const inputType = visible ? "text" : "password";

  return [inputType, Icon];
};

export default usePasswordToggle;
