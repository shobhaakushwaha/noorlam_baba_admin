import DeleteModal from "components/modals/DeleteModal";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import useDebounce from "hooks/UseDebounce";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import { FaqListApi } from "services/supportManagment";
import AddFaqModal from "./AddFaqModal";
import { deleteFaqApi } from "services/supportManagment";
import useFullPageLoader from "common/UseFullPageLoader";
import { toastMessage } from "utils/toastMessage";
import ReactPaginate from "react-paginate";

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

const Faq = ({ refresh, search, faqType = "seller" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [total, setTotal] = useState(null);

  const [loader, onShow, onHide] = useFullPageLoader();

  const [searchParams, setSearchParams] = useSearchParams();
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  // const [search, setSearch] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [count, setCount] = useState();
  const [selectedId, setSelectedId] = useState(null);

  const debouncedValue = useDebounce(search, 300);

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;

  const listData = async () => {
    let data = {
      page: activePage,
      limit: limits,
      type: faqType,
      search: debouncedValue,
    };

    try {
      const { data: response, status } = await FaqListApi(data);
      if (status === 200) {
        const list =
          response?.data?.faqList ||
          response?.data?.list ||
          response?.data?.listing ||
          response?.data;

        setFaqList(Array.isArray(list) ? list : []);
        setTotal(response.data.total);
              console.log("decrypted user list response:-->", response?.data);

        setCount(response?.counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

 

   const handleDeleteFaq = async () => {
      if (!detailsData?._id) return;
      onShow();
      try {
        const { data } = await deleteFaqApi(detailsData._id);
  
        if (data?.status === 200) {
          toastMessage(data.message, "success");
          setIsModalOpen(false);
          setDetailsData({});
        listData();
        }
      } catch (error) {
        console.log("Delete error:", error);
      } finally {
        onHide();
      }
    };
  

  // Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  // pagination / search changes
  useEffect(() => {
    listData();
  }, [activePage, limits, debouncedValue, faqType]);

  //  REFRESH AFTER ADD FAQ
  useEffect(() => {
    if (refresh !== undefined) {
      listData();
    }
  }, [refresh]);

 useEffect(() => {
  const urlInstance = new URLSearchParams(searchParams);
  urlInstance.set("page", 1);
  setSearchParams(urlInstance);
}, [debouncedValue, faqType]);

  const closeAndClear = () => {
    setFaqModalOpen(false);
    setEditFaq(null);
  };

  return (
    <div className="faq_wrapper">
      {faqList && faqList.length > 0 ? (
        faqList.map((item, index) => (
          <div className="title_cards" key={item._id || index}>
            <div className="top-content">
              <div className="heading">
                <h5>{`FAQ ${index + 1}`}</h5>
              </div>

              <div className="common_view actions_wrap">
                {/* <TbEdit onClick={() => setFaqModalOpen(true)} /> */}
                <TbEdit
                  onClick={() => {
                    setEditFaq(item); // pass full faq object
                    setFaqModalOpen(true);
                  }}
                />
                <PiLineVerticalLight />

                {/* <FaTrash
                  className="red"
                  onClick={() => {
                    setIsModalOpen(true);
                    setDetailsData(item);
                  }}
                /> */}


                  <FaTrash
                                          className="red"
                                          onClick={() => {
                                            setIsModalOpen(true);
                                            setDetailsData(item);
                                          }}
                                        />
              </div>
            </div>

            <div className="btm-content">
              <div className="short_content">
                <b>{item?.question}</b>
                <p>{item?.answer}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No FAQs found</p>
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


       <DeleteModal
        heading="Are you sure you want to delete this faq?"
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDetailsData({});
        }}
        onConfirm={handleDeleteFaq}
      />
    

      <AddFaqModal
  modalAdd={faqModalOpen}
  closeAndClear={closeAndClear}
  editFaq={editFaq}
  faqType={faqType}
  onSuccess={listData}
/>

    </div>
  );
};

export default Faq;
