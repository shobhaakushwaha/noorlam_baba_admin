import { song_banner, upload_img } from "assets/images";
import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import { Button, Search, SwitchButton } from "components/form";
import CustomModal from "components/modals/CustomModal";
import DeleteModal from "components/modals/DeleteModal";
import Toggle from "components/modals/Toggle";
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
import {
  changeSubSubcategoryStatusApi,
  deleteSubSubcategoryApi,
  getSubSubcategoryListApi,
} from "services/subSubcategoryManagment";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";
import { toastMessage } from "utils/toastMessage";
import AddCategory from "../categorymanagement/AddCategory";
import "../subcategorymanagment/subcategorymanagement.scss";

const SUB_SUBCATEGORY_TYPE = "sub sub category";
const SUB_SUBCATEGORY_LABEL = "Sub Sub Category";

const SubSubcategoryManagement = () => {
  const [loader, onShow, onHide] = useFullPageLoader();
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 300);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [catDetails, setCatDetails] = useState({});
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState({});
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [subSubCategoryList, setSubSubCategoryList] = useState([]);
  const [total, setTotal] = useState(null);
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const closeAndClear = () => {
    setModalAdd(false);
    setShowEditModel(false);
    setCatDetails({});
    setSelectedSubSubcategory({});
    setStatusModalOpen(false);
    setDeleteModalOpen(false);
  };

  const getSubSubCategoryList = async () => {
    const payload = {
      page: activePage,
      limit: limits,
    };

    if (debouncedSearch && search) {
      payload.search = debouncedSearch;
    }

    onShow();

    try {
      const { data: responseData } = await getSubSubcategoryListApi(payload);

      if (responseData?.status === 200) {
        const listData =
          responseData?.data?.subSubCategoryList ||
          responseData?.data?.subSubcategoryList ||
          responseData?.data?.data ||
          [];

        setSubSubCategoryList(listData);
        setTotal(responseData?.data?.total || 0);
          console.log(responseData, " sub sub category list response")
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getSubSubCategoryList();
  }, [debouncedSearch, activePage, limits]);

  const doResetFun = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("search");
    urlInstance.delete("page");
    setSearchParams(urlInstance);
  };

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const handleDeleteSubSubcategory = async () => {
    if (!catDetails?._id) return;

    onShow();
    try {
      const { data } = await deleteSubSubcategoryApi(catDetails?._id);

      if (data?.status === 200) {
        toastMessage(data?.message, "success");
        closeAndClear();
        getSubSubCategoryList();
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      onHide();
    }
  };

  const handleConfirmStatus = async () => {
    if (!selectedSubSubcategory?._id) return;

    onShow();
    try {
      const res = await changeSubSubcategoryStatusApi({
        subSubCategoryId: selectedSubSubcategory?._id,
        status: !selectedSubSubcategory?.isActive,
      });

      if (res?.data?.status === 200 || res?.status === 200) {
        toastMessage(
          res?.data?.message || "Status updated successfully",
          "success"
        );
        closeAndClear();
        getSubSubCategoryList();
      }
    } catch (error) {
      toastMessage("Failed to update status", "error");
    } finally {
      onHide();
    }
  };

  return (
    <>
      <div className="wrapper_subcategory_management">
        {loader}
        <div className="dashboard_title">
          <h3>{SUB_SUBCATEGORY_LABEL} Management</h3>
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
            + Add {SUB_SUBCATEGORY_LABEL}
          </Button>
        </div>

        <div className="table_wrap table_responsive">
          <table className="table custom_table">
            <thead>
              <tr>
                <th className="nowrap text-center">
                  {SUB_SUBCATEGORY_LABEL} ID
                </th>
                <th className="nowrap text-center">Image</th>
                <th className="nowrap text-center">Sub Category</th>
                <th className="nowrap text-center">Sub Sub Category</th>
                <th className="nowrap text-center">Status</th>
                <th className="nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subSubCategoryList && subSubCategoryList?.length > 0 ? (
                subSubCategoryList.map((data, index) => (
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
                    <td className="text-center">
                      {helperFunForNa(
                        data?.subCategoryId?.name ||
                          data?.subcategoryId?.name
                      )}
                    </td>
                    <td className="text-center">
                      {helperFunForNa(data?.name)}
                    </td>
                    <td className="text-center">
                      <SwitchButton
                        status={data?.isActive}
                        onChange={() => {
                          setSelectedSubSubcategory(data);
                          setStatusModalOpen(true);
                        }}
                      />
                    </td>
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
                <NotFound
                  msg="Sub sub category not available"
                  onHide={true}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        heading="Are you sure you want to delete this sub sub category?"
        show={deleteModalOpen}
        onClose={closeAndClear}
        onConfirm={handleDeleteSubSubcategory}
      />

      <Toggle
        heading="Are you sure you want to change status of this sub sub category?"
        show={statusModalOpen}
        onClose={closeAndClear}
        onConfirm={handleConfirmStatus}
      />

      {modalAdd && (
        <AddCategory
          modalAdd={modalAdd}
          closeAndClear={closeAndClear}
          catTabName={SUB_SUBCATEGORY_TYPE}
          getCatListFun={getSubSubCategoryList}
          isEdit={false}
        />
      )}

      {showEditModel && (
        <AddCategory
          modalAdd={showEditModel}
          closeAndClear={closeAndClear}
          catTabName={SUB_SUBCATEGORY_TYPE}
          getCatListFun={getSubSubCategoryList}
          isEdit={true}
          catDetails={catDetails}
        />
      )}

      {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1}
            pageCount={Math.ceil(total / limits)}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
            previousLabel={<TbPlayerTrackPrevFilled size={25} />}
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
          <img src={imagePreview || upload_img} alt="subsubcategory-preview" />
        </div>
      </CustomModal>
    </>
  );
};

export default SubSubcategoryManagement;
