import React from "react";
import useButtonLoader from "../../hooks/useButtonLoader";
import { toastMessage } from "../../utils/toastMessage";
import { updateUserStatusApi } from "../../services/userManagement";
import DeleteModal from "components/modals/DeleteModal";
import { ImEyeBlocked } from "react-icons/im";
import { TbLockFilled, TbLockOpen2 } from "react-icons/tb";

const ChangeSelectedUserStatus = ({
  selectedUserDetail,
  onClose,
  showStatusModal,
  detailUpdate = false,
  getUserListFun,
}) => {
  const [buttonLoader, setButtonLoader] = useButtonLoader("Yes");

  // change delete handler
  const changeStatusHandler = async () => {
    try {
      setButtonLoader(true);
      const reqData = {
        userId: selectedUserDetail?._id || "",
        // status: !selectedUserDetail.status,
        isActive :!selectedUserDetail.isArtistActive,
        role :'artist'
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
          selectedUserDetail?.isArtistActive ? "Block" : "Unblock"
        }  this user?`}
        heading={`Change "${selectedUserDetail?.artistName}'s" Status `}
        buttonLoader={buttonLoader}
        onConfirm={changeStatusHandler}
        image={selectedUserDetail?.isArtistActive ? <TbLockFilled /> : <TbLockOpen2 />}
      />
    </>
  );
};

export default ChangeSelectedUserStatus;
