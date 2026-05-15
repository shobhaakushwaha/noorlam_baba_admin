import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaAngleDown, FaRegUser, FaUserEdit } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logos } from "../../assets/images";
import { dummyadmin, userPlaceholder } from "assets/icons";
import { TbPasswordFingerprint } from "react-icons/tb";
import DeleteModal from "components/modals/DeleteModal";
import { getToken, removeToken } from "config/axiosInstance";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  // -------------doLogoutFun

  const doLogoutFun = () => {
    logger.log("logout yes button clciked");
    removeToken();
    setIsModalOpen(false);
    toastMessage("Logged Out Successfully", "success", "Logged-In-User");
    navigate("/");
  };

  const hereIsToken = localStorage.getItem("naksha_admin");

  const userInfo = JSON.parse(localStorage.getItem("naka_admin-detail"));
  return (
    <>
      {/* dashboad header start here */}
      <div className="dashboard_header full-width">
        <div className="container">
          <div className={`inner_part ${hereIsToken ? "full-width" : ""}`}>
            <div className="logo">
              <Link to="/dashboard">
                <img src={logos} alt="logo" />
              </Link>
            </div>

            <div className="right_part">
              {hereIsToken && (
                <Dropdown className={"customDropdown profile_dropdown"}>
                  <Dropdown.Toggle id="dropdown-basic">
                    <div className="user_profile">
                      <img src={userInfo?.profile || userPlaceholder} alt="" />
                    </div>
                    <h5>{userInfo?.name || "Admin"}</h5>
                    <FaAngleDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                   

                    <Dropdown.Item
                      onClick={() => {
                        navigate("/change-password");
                      }}
                    >
                      <TbPasswordFingerprint /> Change Password
                    </Dropdown.Item>

                     <Dropdown.Item
                      onClick={() => {
                        navigate("/profile-update");
                      }}
                    >
                      <TbPasswordFingerprint /> Profile update
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setIsModalOpen(true)}>
                      <MdLogout /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* dashboad header start here */}
      <DeleteModal
        show={isModalOpen}
        image={<MdLogout />}
        onClose={() => setIsModalOpen(false)}
        heading="Are you sure you want to Logout"
        onConfirm={doLogoutFun}
      />
    </>
  );
};

// --------------------------------------------------------

// import React from "react";
// import { Dropdown } from "react-bootstrap";
// import { FaAngleDown, FaRegUser, FaUserEdit } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { logo } from "../../assets/images";
// import { dummyadmin } from "assets/icons";
// import { TbPasswordFingerprint } from "react-icons/tb";
// import DeleteModal from "components/modals/DeleteModal";
// import { getToken, removeToken } from "config/axiosInstance";
// import { logger } from "utils/logger";
// import { toastMessage } from "utils/toastMessage";

// export const Header = () => {
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const navigate = useNavigate();

//   // -------------doLogoutFun

//   const doLogoutFun = () => {
//     logger.log("logout yes button clciked");
//     removeToken();
//     setIsModalOpen(false);
//     toastMessage("Logged Out Successfully", "success", "Logged-In-User");
//     navigate("/");
//   };

//   const hereIsToken = localStorage.getItem("naksha_admin");
//   return (
//     <>
//       {/* dashboad header start here */}
//       <div className="dashboard_header full-width">
//         <div className="container">
//           <div className="inner_part full-width">
//             <div className="logo">
//               <Link to="/dashboard">
//                 <img src={logo} alt="logo" />
//               </Link>
//             </div>

//             {hereIsToken && (
//               <div className="right_part">
//                 <Dropdown className={"customDropdown profile_dropdown"}>
//                   <Dropdown.Toggle id="dropdown-basic">
//                     <div className="user_profile">
//                       <img src={dummyadmin} alt="" />
//                     </div>
//                     <h5>Janne</h5>
//                     <FaAngleDown />
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {/* <Dropdown.Item>
//                     <FaUserEdit /> Edit Profile
//                   </Dropdown.Item>
//                   <Dropdown.Item>
//                     <TbPasswordFingerprint /> Change Password
//                   </Dropdown.Item> */}
//                     <Dropdown.Item onClick={() => setIsModalOpen(true)}>
//                       <MdLogout /> Logout
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* dashboad header start here */}
//       <DeleteModal
//         show={isModalOpen}
//         image={<MdLogout />}
//         handleClose={() => setIsModalOpen(false)}
//         title="Are you sure you want to Logout"
//         action={doLogoutFun}
//       />
//     </>
//   );
// };
