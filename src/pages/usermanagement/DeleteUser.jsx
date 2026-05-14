import DeleteModal from "components/modals/DeleteModal";
import useButtonLoader from "hooks/useButtonLoader";
import React from "react";
import { MdDeleteSweep } from "react-icons/md";
import { deleteCategoryApi } from "services/CategoryManagement";
import { deleteUserApi } from "services/userManagement";
import { firstWordCapital } from "utils/common";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

const DeleteUser = ({
  userDetails,
  closeAndClear,
  deleteModalOpen,
  getUserListFun,
}) => {
  const [buttonLoader, setButtonLoader] = useButtonLoader("Delete");

  logger.log("userDetails:--------->", userDetails?._id);
  // change delete handler
  const changeDeleteHandler = async () => {
    try {
      setButtonLoader(true);

      if (userDetails?._id) {
        const res = await deleteUserApi({
          id: userDetails?._id,
        });

        if (res?.data?.status === 200) {
          toastMessage(res?.data?.message, "success", "Deleted-User");
          getUserListFun();
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
      <DeleteModal
        show={deleteModalOpen}
        onClose={closeAndClear}
        content={`Are you sure you want to Delete this ${firstWordCapital(
          userDetails?.name
        )}?`}
        heading={`Delete ${firstWordCapital(userDetails?.name)}`}
        buttonLoader={buttonLoader}
        onConfirm={changeDeleteHandler}
        image={<MdDeleteSweep />}
      />
    </>
  );
};

export default DeleteUser;
