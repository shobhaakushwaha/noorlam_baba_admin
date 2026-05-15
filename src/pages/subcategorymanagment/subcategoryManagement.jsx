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
  changeStatusAPI,
  deleteSubcategoryApi,
  getSubcategoryListApi,
} from "services/subcategoryManagment";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";
import { toastMessage } from "utils/toastMessage";
import AddCategory from "../categorymanagement/AddCategory";
import "./subcategorymanagement.scss";

const SUBCATEGORY_TYPE = "sub category";
const SUBCATEGORY_LABEL = "Sub Category";

const SubcategoryManagement = () => {
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
  const [selectedSubcategory, setSelectedSubcategory] = useState({});
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [total, setTotal] = useState(null);
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const closeAndClear = () => {
    setModalAdd(false);
    setShowEditModel(false);
    setCatDetails({});
    setSelectedSubcategory({});
    setStatusModalOpen(false);
    setDeleteModalOpen(false);
  };

  const getSubCategoryList = async () => {
    const payload = {
      type: SUBCATEGORY_TYPE,
      page: activePage,
      limit: limits,
    };

    if (debouncedSearch && search) {
      payload.search = debouncedSearch;
    }

    onShow();

    try {
      const { data: responseData } = await getSubcategoryListApi(payload);

      if (responseData?.status === 200) {
        setSubCategoryList(responseData?.data?.subCategoryList || []);
        setTotal(responseData?.data?.total || 0);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getSubCategoryList();
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

  const handleDeleteSubcategory = async () => {
    if (!catDetails?._id) return;

    onShow();
    try {
      const { data } = await deleteSubcategoryApi(catDetails?._id);

      if (data?.status === 200) {
        toastMessage(data?.message, "success");
        closeAndClear();
        getSubCategoryList();
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      onHide();
    }
  };

  const handleConfirmStatus = async () => {
    if (!selectedSubcategory?._id) return;

    onShow();
    try {
      const res = await changeStatusAPI({
        subcategoryId: selectedSubcategory?._id,
        status: !selectedSubcategory?.isActive,
      });

      if (res?.data?.status === 200 || res?.status === 200) {
        toastMessage(
          res?.data?.message || "Status updated successfully",
          "success"
        );
        closeAndClear();
        getSubCategoryList();
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
          <h3>{SUBCATEGORY_LABEL} Management</h3>
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
            + Add {SUBCATEGORY_LABEL}
          </Button>
        </div>

        <div className="table_wrap table_responsive">
          <table className="table custom_table">
            <thead>
              <tr>
                <th className="nowrap text-center">{SUBCATEGORY_LABEL} ID</th>
                <th className="nowrap text-center">Image</th>
                <th className="nowrap text-center">Category</th>
                <th className="nowrap text-center">Sub Category</th>
                {/* <th className="nowrap text-center">Slug</th> */}
                {/* <th className="nowrap text-center">Sort Order</th> */}
                <th className="nowrap text-center">Status</th>
                <th className="nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategoryList && subCategoryList?.length > 0 ? (
                subCategoryList.map((data, index) => (
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
                      {helperFunForNa(data?.categoryId?.name)}
                    </td>
                    <td className="text-center">
                      {helperFunForNa(data?.name)}
                    </td>
                    {/* <td className="text-center">{helperFunForNa(data?.slug)}</td> */}
                    {/* <td className="text-center">{data?.sortOrder ?? 0}</td> */}
                    <td className="text-center">
                      <SwitchButton
                        status={data?.isActive}
                        onChange={() => {
                          setSelectedSubcategory(data);
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
                <NotFound msg="Sub category not available" onHide={true} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        heading="Are you sure you want to delete this sub category?"
        show={deleteModalOpen}
        onClose={closeAndClear}
        onConfirm={handleDeleteSubcategory}
      />

      <Toggle
        heading="Are you sure you want to change status of this sub category?"
        show={statusModalOpen}
        onClose={closeAndClear}
        onConfirm={handleConfirmStatus}
      />

      {modalAdd && (
        <AddCategory
          modalAdd={modalAdd}
          closeAndClear={closeAndClear}
          catTabName={SUBCATEGORY_TYPE}
          getCatListFun={getSubCategoryList}
          isEdit={false}
        />
      )}

      {showEditModel && (
        <AddCategory
          modalAdd={showEditModel}
          closeAndClear={closeAndClear}
          catTabName={SUBCATEGORY_TYPE}
          getCatListFun={getSubCategoryList}
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
          <img src={imagePreview || upload_img} alt="subcategory-preview" />
        </div>
      </CustomModal>
    </>
  );
};

export default SubcategoryManagement;
