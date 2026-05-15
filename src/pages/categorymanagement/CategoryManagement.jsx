import { song_banner, upload_img } from "assets/images";
import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import { Button, Search } from "components/form";
import CustomModal from "components/modals/CustomModal";
import useDebounce from "hooks/UseDebounce";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { PiLineVerticalLight } from "react-icons/pi";
import {
  TbEdit,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import { getCategoryListApi } from "services/CategoryManagement";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";
import AddCategory from "./AddCategory";
import DeleteCategory from "./DeleteCategory";

const CATEGORY_TYPE = "category";
const CATEGORY_LABEL = "Category";

const CategoryManagement = () => {
  const [loader, onShow, onHide] = useFullPageLoader();

  // -----------------use params
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";

  const debaunceValue = useDebounce(search, 300);

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [catDetails, setCatDetails] = useState({});

  const [showEditModel, setShowEditModel] = useState(false);

  const closeAndClear = () => {
    setModalAdd(false);
    setShowEditModel(false);
    setCatDetails({});
    setDeleteModalOpen(false);
  };

  // ---------------lists
  const [catLists, setCatLists] = useState([]);

  const [total, setTotal] = useState(null);

  const getCatListFun = async () => {
    const payload = {
      page: activePage,
      limit: limits,
      search: debaunceValue || "",
    };

    if (debaunceValue && search) {
      payload.search = debaunceValue;
    }

    onShow();
 console.log("payload:-->", payload);
    try {
      const { data: responseData } = await getCategoryListApi(payload);

      if (responseData?.status === 200) {
        const listData =
          responseData?.data?.categoryList || responseData?.data?.data || [];

        setCatLists(listData);
        setTotal(responseData?.data?.total || 0);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getCatListFun();
  }, [debaunceValue, activePage, limits]);

  // -------------------doResetFun

  const doResetFun = () => {
    const urlIns = new URLSearchParams(searchParams);
    urlIns.delete("search");
    urlIns.delete("page");
    setSearchParams(urlIns);
  };

  // Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  // --------------clear

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  return (
    <>
      <div className="wrapper_category_management">
        {loader}
        <div className="dashboard_title">
          <h3>{CATEGORY_LABEL} Management</h3>
        </div>
        <div className="wrapper_search">
          <div className="wrap_search">
            <Search
              value={search}
              onChange={(e) => {
                const urlInstance = new URLSearchParams(searchParams);
                urlInstance.delete("page");

                urlInstance.set("search", e.target.value);
                setSearchParams(urlInstance);
              }}
            />
            <Button>
              <FiRefreshCcw onClick={doResetFun} />
            </Button>
          </div>
          <Button className="light_button" onClick={() => setModalAdd(true)}>
            + Add {CATEGORY_LABEL}
          </Button>
        </div>

        <div className="table_wrap table_responsive">
          <table className="table custom_table">
            <thead>
              <tr>
                <th className="nowrap text-center">{CATEGORY_LABEL} ID</th>
                <th className="nowrap text-center">Image</th>
                <th className="nowrap text-center">Name</th>
                {/* <th className="nowrap text-center">Slug</th> */}
                {/* <th className="nowrap text-center">Sort Order</th> */}
                <th className="nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {catLists && catLists?.length > 0 ? (
                catLists.map((data, index) => (
                  <tr key={data?._id || index}>
                    <td className="text-center">
                      {findSerialNumber(index, activePage, limits)}
                    </td>
                    <td className="text-center">
                      <img
                        className="cstm_img_table"
                        src={data?.image || song_banner}
                        alt=""
                        onClick={() =>
                          showImagePreviewHandler(data?.image || upload_img)
                        }
                      />
                    </td>
                    <td className="text-center">{helperFunForNa(data?.name)}</td>
                    {/* <td className="text-center">{helperFunForNa(data?.slug)}</td>
                    // <td className="text-center">{data?.sortOrder ?? 0}</td> */}
                    <td className="text-center">
                      <div className="common_view actions_wrap">
                        <TbEdit
                          onClick={() => {
                            setCatDetails(data);
                            setShowEditModel(true);
                          }}
                        />
                        <PiLineVerticalLight />
                        <FaTrash
                          className="red"
                          onClick={() => {
                            setDeleteModalOpen(true);
                            setCatDetails(data);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <NotFound msg="Category not available" onHide={true} />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* delet modal */}
      {deleteModalOpen && (
        <DeleteCategory
          catDetails={catDetails}
          deleteModalOpen={deleteModalOpen}
          closeAndClear={closeAndClear}
          getCatListFun={getCatListFun}
          catTabName={CATEGORY_TYPE}
        />
      )}

      {/* add genre modal */}

      {modalAdd && (
        <AddCategory
          modalAdd={modalAdd}
          closeAndClear={closeAndClear}
          catTabName={CATEGORY_TYPE}
          getCatListFun={getCatListFun}
          // ---------for edit
          isEdit={false}
        />
      )}

      {/* -------------edit model */}

      {showEditModel && (
        <AddCategory
          modalAdd={showEditModel}
          closeAndClear={closeAndClear}
          catTabName={CATEGORY_TYPE}
          getCatListFun={getCatListFun}
          // ------------to edit
          isEdit={true}
          catDetails={catDetails}
        />
      )}

      {/* ------------pagination */}
      {/* {total > limits && (
        <div className="pagination-wrapper">
          <div className="Pagination">
            <Pagination
              activePage={activePage}
              previousLabel={"previous"}
              nextLabel={"next"}
              itemsCountPerPage={limits}
              totalItemsCount={total}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              hideDisabled={true}
            />
          </div>
        </div>
      )} */}

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

      {/* Image Preview model */}
      <CustomModal
        className={"md image_preview_modal image_modal_sec"}
        show={showImagePreviewModel}
        handleClose={() => {
          setImagePreview("");
          setShowImagePreviewModel(false);
        }}
      >
        <div className="image_preview">
          <img src={imagePreview || upload_img} alt="user-profile-preview" />
        </div>
      </CustomModal>
    </>
  );
};

export default CategoryManagement;
