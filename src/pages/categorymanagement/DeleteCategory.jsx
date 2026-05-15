import CmnModal from "components/modals/CmnModal";
import useButtonLoader from "hooks/useButtonLoader";
import React from "react";
import { MdDeleteSweep } from "react-icons/md";
import { deleteCategoryApi } from "services/CategoryManagement";
import { firstWordCapital } from "utils/common";
import { toastMessage } from "utils/toastMessage";

const DeleteCategory = ({
  catDetails,
  closeAndClear,
  deleteModalOpen,
  catTabName,
  getCatListFun,
}) => {
  const [buttonLoader, setButtonLoader] = useButtonLoader("Delete");

  // change delete handler
  const changeDeleteHandler = async () => {
    try {
      setButtonLoader(true);

      if (catDetails?._id) {
        // const {
        //   data: { message, status },
        // } = await deleteCategoryApi({
        //   id: catDetails?._id,
        // });

        const res = await deleteCategoryApi({
          id: catDetails?._id,
        });

        if (res?.data?.status === 200) {
          toastMessage(res?.data?.message, "success", "Deleted-User");
          getCatListFun();
          closeAndClear();
        }
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setButtonLoader(false);
    }
  };

  return (
    <>
      <CmnModal
        show={deleteModalOpen}
        handleClose={closeAndClear}
        content={`Are you sure you want to Delete this ${firstWordCapital(
          catTabName
        )}?`}
        title={`Delete ${firstWordCapital(catTabName)}`}
        buttonLoader={buttonLoader}
        action={changeDeleteHandler}
        image={<MdDeleteSweep />}
      />
    </>
  );
};

export default DeleteCategory;
