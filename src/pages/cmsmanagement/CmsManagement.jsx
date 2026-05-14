import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomModal from "components/modals/CustomModal";
import JoditEditor from "jodit-react";
import { FaPlus } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import "./CmsManagement.scss";
import {
  editCmsContentApi,
  getCmsContentListApi,
} from "services/contentManagement";
import { logger } from "utils/logger";
import { SanitizeTxtForJoditEditor } from "components/SanitizeTxtForJoditEditor/SanitizeTxtForJoditEditor";
import { toastMessage } from "utils/toastMessage";
import useFullPageLoader from "common/UseFullPageLoader";

const CMS_TYPES = ["terms", "about", "privacy_policy"];

const normalizeCmsType = (type) => {
  const cmsType = String(type || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\s-]+/g, "_");

  const typeMap = {
    policy: "privacy_policy",
    privacy: "privacy_policy",
    privacy_policy: "privacy_policy",
    about_us: "about",
    about: "about",
    terms_and_conditions: "terms",
    terms_conditions: "terms",
    terms_condition: "terms",
    terms: "terms",
  };

  return typeMap[cmsType] || "";
};

const getCmsTypeFromItem = (item) => {
  return normalizeCmsType(item?.type) || normalizeCmsType(item?.title);
};

const doNameFormat = (name) => {
  const nameObj = {
    terms: "Terms & Conditions",
    about: "About US",
    privacy_policy: "Privacy Policy",
  };

  return nameObj[normalizeCmsType(name)] || "NA";
};

const getCmsTitle = (type) => {
  const titleObj = {
    terms: "terms_and_conditions",
    about: "about",
    privacy_policy: "privacy_policy",
  };

  return titleObj[normalizeCmsType(type)] || "";
};

const CmsManagement = () => {
  const [loader, onShow, onHide] = useFullPageLoader();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [inputDetails, setInputDetails] = useState({});

  const closeModel = () => {
    setIsModalOpen(false);
    setInputDetails({});
  };

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const [CMSListData, setCMSListData] = useState([]);

  // logger.log("CMSListData:-->", CMSListData);

  const normalizeCmsList = (data) => {
    if (Array.isArray(data)) return data;

    const list =
      data?.cmsList ||
      data?.cms ||
      data?.list ||
      data?.items ||
      data?.content ||
      data?.contents ||
      data?.rows;

    return Array.isArray(list) ? list : [];
  };

  const getUniqueCmsListByType = (list) => {
    const cmsByType = new Map();

    list.forEach((item) => {
      const cmsType = getCmsTypeFromItem(item);

      if (cmsType && !cmsByType.has(cmsType)) {
        cmsByType.set(cmsType, item);
      }
    });

    return CMS_TYPES.map((cmsType) => cmsByType.get(cmsType)).filter(Boolean);
  };

  // ------------------get api for data

  const getCMSList = async (type) => {
    onShow();
    try {
      const types = type ? [normalizeCmsType(type)] : CMS_TYPES;
      const responses = await Promise.allSettled(
        types.map((cmsType) => getCmsContentListApi({ type: cmsType })),
      );

      const list = responses.flatMap((response) =>
        response.status === "fulfilled" && response.value?.data?.status === 200
          ? normalizeCmsList(response.value?.data?.data)
          : [],
      );

      setCMSListData(getUniqueCmsListByType(list));
    } catch (error) {
      console.log("CMS list error:---->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getCMSList();
  }, []);

  return (
    <div className="content_management">
      {loader}
      <div className="dashboard_title">
        <h3>CMS Management</h3>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="contentManagement">
            {Array.isArray(CMSListData) && CMSListData?.map((data, index) => (
              <div className="content-grid" key={index}>
                <div className="content-card">
                  <h4>{data?.type ? doNameFormat(data?.type) : "NA"}</h4>

                  <button
                    className="edit-button"
                    onClick={() => {
                      setInputDetails(data);
                      setIsModalOpen(true);
                    }}
                  >
                    <TbEdit /> Edit
                  </button>
                </div>
                <p>
                  {data?.content || data?.description ? (
                    <SanitizeTxtForJoditEditor
                      content={data?.content || data?.description}
                    />
                  ) : (
                    "NA"
                  )}
                </p>
              </div>
            ))}

            {isModalOpen && (
              <EditContentMangement
                showCMSModel={isModalOpen}
                closeModel={closeModel}
                inputDetails={inputDetails}
                getCMSList={getCMSList}
                doNameFormat={doNameFormat}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsManagement;

const EditContentMangement = ({
  showCMSModel,
  closeModel,
  inputDetails = {},
  getCMSList,
  doNameFormat,
}) => {
  const editor = useRef(null);
  const config = { readonly: false };

  // ---------------------------usestate part
  const [error, setError] = useState({});
  const [articalInput, setArticalInput] = useState("");
  const [articalTitle, setArticalTitle] = useState("");

  useEffect(() => {
    if (inputDetails && Object.keys(inputDetails)?.length > 0) {
      setArticalInput(inputDetails?.content || inputDetails?.description || "");
      setArticalTitle(getCmsTypeFromItem(inputDetails));
    }
  }, [inputDetails]);

  // ---------edit

  // ---------------validation

  const doValidation = () => {
    let status = true;
    const errors = {};

    const stripHtml = (html) => {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    };

    if (stripHtml(articalInput).trim().length === 0) {
      status = false;
      errors.articalInput = "Artical can't be empty";
    }

    if (!(normalizeCmsType(articalTitle) || getCmsTypeFromItem(inputDetails))) {
      status = false;
      errors.articalTitle = "CMS type is invalid";
    }

    setError(errors);
    return status;
  };

  const doEditMyCMS = async () => {
    if (doValidation()) {
      const type = normalizeCmsType(articalTitle) || getCmsTypeFromItem(inputDetails);
      const reqQuery = {
        type,
        title: getCmsTitle(type) || inputDetails?.title,
        content: articalInput,
      };

      try {
        const {
          data: { status, message },
        } = await editCmsContentApi(reqQuery);

        if ([200, 201].includes(status)) {
          console.log("success  message:----------->", message);
          getCMSList();
          toastMessage(message, "success", "Cms-Content");
          closeModel();
        }
      } catch (error) {
        console.log("error:-------------->", error);
      }
    }
  };

  return (
    <CustomModal
      className={"content_management_modal md"}
      show={showCMSModel}
      handleClose={closeModel}
    >
      <div className="inner_content">
        <div className="top-heading">
          <h2>{doNameFormat(articalTitle)}</h2>
          {error?.articalTitle && (
            <div style={{ color: "red" }}>
              <p>{error?.articalTitle}</p>
            </div>
          )}
        </div>
        <div className="full_description">
          <JoditEditor
            ref={editor}
            value={articalInput} // Jodit will render HTML properly
            config={config}
            tabIndex={1}
            onBlur={(newContent) => setArticalInput(newContent)}
          />

          {error?.articalInput && (
            <div style={{ color: "red" }}>
              <p>{error?.articalInput}</p>
            </div>
          )}
        </div>

        <div className="button_wrap">
          {/* <span>Max 50 alphabets</span> */}
          <div>
            <button className="button " onClick={closeModel}>
              Cancel
            </button>
          </div>
          <div className="right_button">
            <button className="button" onClick={doEditMyCMS}>
              Save
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

// ----------------------------------------------------------old code

// import React, { useMemo, useRef, useState } from "react";
// import CustomModal from "components/modals/CustomModal";
// import JoditEditor from "jodit-react";
// import { FaPlus } from "react-icons/fa";
// import { TbEdit } from "react-icons/tb";
// import "./CmsManagement.scss";

// const CmsManagement = ({ placeholder }) => {
// const [isModalOpen, setIsModalOpen] = React.useState(false);

//   const editor = useRef(null);
//   const [content, setContent] = useState("");

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       placeholder: placeholder || "Start typings...",
//     }),
//     [placeholder]
//   );
//   return (
//     <div className="content_management">
//       <div className="dashboard_title">
//         <h3>CMS Management</h3>
//       </div>
//       <div className="card">
//         <div className="card-body">
//           <div className="contentManagement">
//             <div className="content-grid">
//               <div className="content-card">
//                 <h4>About Platform</h4>
//                  <button
//                   className="edit-button"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   <TbEdit /> Edit
//                 </button>
//               </div>
//               <p>
//                 Sed ut perspiciatis unde omnis iste natus error sit voluptatem
//                 accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
//                 quae ab illo inventore veritatis et quasi architecto beatae
//                 vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
//                 voluptas sit aspernatur aut odit aut fugit, sed quia
//                 consequuntur magni dolores eos qui ratione voluptatem sequi
//                 nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
//                 sit amet, consectetur, adipisci velit, sed quia non numquam eius
//                 modi tempora incidunt ut labore et dolore magnam aliquam quaerat
//                 voluptatem. Ut enim ad minima veniam, quis nostrum
//                 exercitationem ullam corporis suscipit laboriosam, nisi ut
//                 aliquid ex ea commodi consequatur? Quis autem vel eum iure
//                 reprehenderit qui in ea voluptate velit esse quam nihil
//                 molestiae consequatur, vel illum qui dolorem eum fugiat quo
//                 voluptas nulla pariatur?"
//               </p>
//             </div>
//             <div className="content-grid">
//               <div className="content-card">
//                 <h4>Terms & Conditions</h4>
//                  <button
//                   className="edit-button"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   <TbEdit /> Edit
//                 </button>
//               </div>
//                <p>
//                 Sed ut perspiciatis unde omnis iste natus error sit voluptatem
//                 accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
//                 quae ab illo inventore veritatis et quasi architecto beatae
//                 vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
//                 voluptas sit aspernatur aut odit aut fugit, sed quia
//                 consequuntur magni dolores eos qui ratione voluptatem sequi
//                 nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
//                 sit amet, consectetur, adipisci velit, sed quia non numquam eius
//                 modi tempora incidunt ut labore et dolore magnam aliquam quaerat
//                 voluptatem. Ut enim ad minima veniam, quis nostrum
//                 exercitationem ullam corporis suscipit laboriosam, nisi ut
//                 aliquid ex ea commodi consequatur? Quis autem vel eum iure
//                 reprehenderit qui in ea voluptate velit esse quam nihil
//                 molestiae consequatur, vel illum qui dolorem eum fugiat quo
//                 voluptas nulla pariatur?"
//               </p>
//             </div>
//             <div className="content-grid">
//               <div className="content-card">
//                 <h4>Privacy Policy</h4>
//                 <button
//                   className="edit-button"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   <TbEdit /> Edit
//                 </button>
//               </div>
//                <p>
//                 Sed ut perspiciatis unde omnis iste natus error sit voluptatem
//                 accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
//                 quae ab illo inventore veritatis et quasi architecto beatae
//                 vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
//                 voluptas sit aspernatur aut odit aut fugit, sed quia
//                 consequuntur magni dolores eos qui ratione voluptatem sequi
//                 nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
//                 sit amet, consectetur, adipisci velit, sed quia non numquam eius
//                 modi tempora incidunt ut labore et dolore magnam aliquam quaerat
//                 voluptatem. Ut enim ad minima veniam, quis nostrum
//                 exercitationem ullam corporis suscipit laboriosam, nisi ut
//                 aliquid ex ea commodi consequatur? Quis autem vel eum iure
//                 reprehenderit qui in ea voluptate velit esse quam nihil
//                 molestiae consequatur, vel illum qui dolorem eum fugiat quo
//                 voluptas nulla pariatur?"
//               </p>
//             </div>

//             {/* Custom Modal for editing or adding content */}
//             <CustomModal
//               show={isModalOpen}
//               handleClose={() => setIsModalOpen(false)}
//               className="lg edit_content_modal"
//               size="lg"
//             >
//               <h3>About Platform</h3>
//               <JoditEditor
//                 ref={editor}
//                 value={content}
//                 // config={config}
//                 tabIndex={1} //
//                 onBlur={(newContent) => setContent(newContent)}
//                 onChange={(newContent) => {}}
//                 config={{
//                     readonly: false,
//                     height: 300,
//                     placeholder: "Edit content here...",
//                   }}
//               />
//               <div className="button_wrap">
//                 <button
//                   type="button"
//                   className="button light"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button type="button" className="button">
//                   Save
//                 </button>
//               </div>
//             </CustomModal>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CmsManagement;
