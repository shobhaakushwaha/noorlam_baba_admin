import React from "react";
import { FaUserTie } from "react-icons/fa";

const NotFound = ({
  cols = 9,
  msg = "No Entries Found",
  icon = <FaUserTie />,
  onHide,
}) => {
  return (
    onHide && (
      <tr>
        <td colSpan={cols}>
          <div className="text-center mt-2">
            <div className=" cstm_style_icon my-1">{icon}</div>
            <h5>{msg}</h5>
          </div>
        </td>
      </tr>
    )
  );
};

export default NotFound;
