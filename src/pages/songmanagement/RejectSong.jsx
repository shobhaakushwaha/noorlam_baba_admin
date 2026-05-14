const RejectSong = ({
  showRejectModel = false,
  closeAndClear = () => {},
  songDetails = {},
}) => {
  const [reason, setReason] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const navigate = useNavigate();

  const rejectSongFun = async () => {
    if (!reason.trim()) return;

    const payload = {
      songId: songDetails?._id,
      status: "rejected",
      rejectedReason: reason,
    };

    try {
      setButtonLoader(true);

      const response = await acceptRejectSongReqApi(payload);

      if (response?.status === 200) {
        toastMessage(response?.data?.message, "success");
        closeAndClear();
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoader(false);
    }
  };

  return (
    <CustomModal
      className={"content_management_modal md"}
      show={showRejectModel}
      handleClose={closeAndClear}
    >
      <div className="form_field">
        <h3>Reject song request</h3>

        <TextArea
          placeholder="Please enter rejection reason"
          label="Reason to reject"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="button_wrap">
        <button className="button light" onClick={closeAndClear}>
          Cancel
        </button>

        <button
          className="button"
          onClick={rejectSongFun}
          disabled={!reason.trim() || buttonLoader}
        >
          Reject
        </button>
      </div>
    </CustomModal>
  );
};
