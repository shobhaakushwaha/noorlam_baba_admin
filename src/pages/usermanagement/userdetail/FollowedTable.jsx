import { song_banner } from "assets/images";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getUsersFollowApi } from "services/userManagement";
import { userPlaceholder } from "assets/icons";
import NotFound from "common/NotFound";
import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import CustomModal from "components/modals/CustomModal";

const FollowedTable = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState();

  const [followedList, setFollowedList] = useState([]);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const [userDetailsInfo, setUserDetailsInfo] = useState({});
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  

  const getUserSavedList = async () => {
    // onShow();
    let payload = {
      userId: userId,
      // role: "",
      page: activePage,
      limit: limits,
      // type: "saved",
    };
    try {
      const {
        data: { status, data },
      } = await getUsersFollowApi(payload);

      if (status === 200) {
        setUserDetailsInfo(data || {});
        setFollowedList(data.artists);
        setTotal(data.total);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      // onHide();
    }
  };

  useEffect(() => {
    if (userId) {
      getUserSavedList();
    }
  }, [userId, activePage, limits]);
  return (
    <div className="table_wrap table_responsive ">
      <table className="table custom_table">
        <thead>
          <tr>
            <th className="nowrap text-center">Artist ID</th>
            <th className="nowrap text-center">Profile</th>
            <th className="nowrap text-center">Name</th>
            <th className="nowrap text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {followedList && followedList?.length > 0 ? (
            followedList.map((data, index) => (
              <tr key={index}>
                <td className="text-center">{data?.userNumber}</td>
                <td className="text-center">
                  <img
                    className="cstm_img_table profile_img"
                    src={data?.artistProfile || userPlaceholder}
                    alt=""
                    onClick={() =>
                      showImagePreviewHandler(
                        data?.artistProfile || userPlaceholder,
                      )
                    }
                  />
                </td>
                <td className="text-center">
                  {data?.artistName ? data?.artistName : "N/A"}{" "}
                </td>

                <td className="text-center">
                  <div className="common_view single_view">
                    {/* <Link className="cstm_anchor" to={"/"}>
                      <FaRegEye />
                      <span>View</span>
                    </Link> */}

                     <Link to={`/seller-management/seller-detail/${data.artistId}`}>
                                            <FaRegEye />
                                          </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <NotFound msg="Followed list not available" onHide={true} />
          )}
        </tbody>
      </table>
       {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1} // ZERO-based index
            pageCount={Math.ceil(total / limits)}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
            // previousLabel="Previous"
            previousLabel={<TbPlayerTrackPrevFilled size={25} />}
            // nextLabel="Next"
            nextLabel={<TbPlayerTrackNextFilled size={25} />}
            breakLabel="..."
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
            previousClassName="page-item"
            nextClassName="page-item"
            disabledClassName="disabled"
          />
        </div>
      )}
       <CustomModal
        className={"md image_preview_modal image_modal_sec"}
        show={showImagePreviewModel}
        handleClose={() => {
          setImagePreview("");
          setShowImagePreviewModel(false);
        }}
      >
        <div className="image_preview">
          <img
            src={imagePreview || userPlaceholder}
            alt="user-profile-preview"
          />
        </div>
      </CustomModal>

    </div>
  );
};

export default FollowedTable;
