import { song_banner, userplaceholder } from "assets/images";
import { userPlaceholder } from "assets/icons";

import NotFound from "common/NotFound";
import CustomModal from "components/modals/CustomModal";
import React, { use, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getUserdetailsApi } from "services/userManagement";
import { findSerialNumber } from "utils/formValidator";

const GenresTable = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState();

  const [genreIdList, setGenreList] = useState([]);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const [userDetailsInfo, setUserDetailsInfo] = useState({});
   const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const getUserDetailsFun = async () => {
    // onShow();
    let payload = {
      userId: userId,
      role: "",
      page: activePage,
      limit: limits,
    };
    try {
      const {
        data: { status, data },
      } = await getUserdetailsApi(payload);

      if (status === 200) {
        setUserDetailsInfo(data || {});
        setTotal(data.genrePagination.totalGenres);
        setGenreList(data.genres);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      // onHide();
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetailsFun();
    }
  }, [userId,activePage, limits]);
  return (
    <div className="table_wrap table_responsive">
      <table className="table custom_table">
        <thead>
          <tr>
            <th className="nowrap text-center">Genre ID</th>
            <th className="nowrap text-center">Image</th>
            <th className="nowrap text-center">Title</th>
          </tr>
        </thead>
     

        <tbody>
          {genreIdList && genreIdList?.length > 0 ? (
            genreIdList.map((data, index) => (
              <tr key={index}>
                <td className="text-center">
                  {" "}
                  {findSerialNumber(index, activePage, limits)}
                </td>
                <td className="text-center">
                  <img className="cstm_img_table" src={data?.image} alt=""  onClick={() =>

  showImagePreviewHandler(
data?.image || userplaceholder,
 )
 }/>
                </td>
                <td className="text-center">{data?.name}</td>
              </tr>
            ))
          ) : (
            <NotFound msg="Genres list not available" onHide={true} />
          )}

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
        </tbody>
      </table>
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
            src={imagePreview || userplaceholder}
            alt="user-profile-preview"
          />
        </div>
      </CustomModal>
    </div>
    
  );
};

export default GenresTable;
