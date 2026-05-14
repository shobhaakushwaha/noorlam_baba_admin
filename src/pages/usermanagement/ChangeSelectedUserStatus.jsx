import React from "react";
import useButtonLoader from "../../hooks/useButtonLoader";
import { toastMessage } from "../../utils/toastMessage";
import { updateUserStatusApi } from "../../services/userManagement";
import DeleteModal from "components/modals/DeleteModal";
import { ImEyeBlocked } from "react-icons/im";
import { TbLockFilled, TbLockOpen2 } from "react-icons/tb";

const normalizeBoolean = (value) => value === true || value === "true";

const ChangeSelectedUserStatus = ({
  selectedUserDetail,
  onClose,
  showStatusModal,
  detailUpdate = false,
  getUserListFun,
}) => {
  const [buttonLoader, setButtonLoader] = useButtonLoader("Yes");
  const userName =
    selectedUserDetail?.fullName || selectedUserDetail?.name || "User";
  const userStatus =
    selectedUserDetail?.status ?? selectedUserDetail?.isActive ?? false;
  const currentStatus = normalizeBoolean(userStatus);
  const nextStatus = !currentStatus;

  // change delete handler
  const changeStatusHandler = async () => {
    try {
      setButtonLoader(true);
      const reqData = {
        userId: selectedUserDetail?._id || "",
        status: String(nextStatus),
      };

      const {
        data: { message, status },
      } = await updateUserStatusApi(reqData);
      if (status === 200) {
        getUserListFun();
        toastMessage(message, "success", "changeUserStatus");
        onClose();
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
        show={showStatusModal}
        onClose={onClose}
        content={`Are you sure you want to  ${
          currentStatus ? "Block" : "Unblock"
        }  this user?`}
        heading={`Change ${userName}'s Status `}
        buttonLoader={buttonLoader}
        onConfirm={changeStatusHandler}
        image={currentStatus ? <TbLockFilled /> : <TbLockOpen2 />}
      />
    </>
  );
};

export default ChangeSelectedUserStatus;
