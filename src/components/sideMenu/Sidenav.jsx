import { MdDashboard, MdSupervisorAccount, MdLibraryMusic, MdSupportAgent } from "react-icons/md";
import { BiSolidCategoryAlt, BiImages } from "react-icons/bi";
import { GiMicrophone } from "react-icons/gi";
import { IoMusicalNotes, IoDocumentText } from "react-icons/io5";
import { HiViewGrid } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const sideMenuData = () => {
  return [
    {
      id: 1,
      enabled: true,
      path: "/dashboard",
      name: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      id: 2,
      enabled: true,
      path: "/user-management",
      name: "User Management",
      icon: <MdSupervisorAccount />,
    },
    {
      id: 3,
      enabled: true,
      path: "/seller-management",
      name: "Seller Management",
      icon: <GiMicrophone />,
    },
    // {
    //   id: 4,
    //   enabled: true,
    //   path: "/content-management",
    //   name: "Content Management",
    //   icon: <MdLibraryMusic />,
    // },
    {
      id: 5,
      enabled: true,
      path: "/banner-management",
      name: "Banner Management",
      icon: <BiImages />,
    },
    {
      id: 7,
      enabled: true,
      path: "/support-management",
      name: "Support Management",
      icon: <MdSupportAgent />,
    },
    {
      id: 8,
      enabled: true,
      path: "/category-management",
      name: "Category Management",
      icon: <HiViewGrid />,
    },
      {
      id: 9,
      enabled: true,
      path: "/subcategory-management",
      name: "SubCategory Management",
      icon: <HiViewGrid />,
    },
    {
      id: 10,
      enabled: true,
      path: "/cms-management",
      name: "CMS Management",
      icon: <IoDocumentText />,
    },
    // {
    //   id: 11,
    //   enabled: true,
    //   path: "/song-management",
    //   name: "Song Management",
    //   icon: <IoMusicalNotes />,
    // },
    //    {
    //   id: 12,
    //   enabled: true,
    //   path: "/reports-management",
    //   name: "Reports Management",
    //   icon: <IoDocumentText />,
    // },
     {
      id: 13,
      enabled: true,
      path: "/notification-management",
      name: "Notification Management",
      icon: <IoDocumentText />,
    },

  
  ].filter((item) => item.enabled);
};  

const Sidenav = () => {
  return (
    <div className="inner_list">
      <ul>
        {sideMenuData().map(({ id, path, name, icon }) => (
          <li key={id}>
            <NavLink to={path}>
              <span className="icon_wrap">{icon}</span>
              <span className="menu_text">{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidenav;
