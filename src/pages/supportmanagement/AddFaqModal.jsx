import { Button, Input, TextArea } from "components/form";
import CustomModal from "components/modals/CustomModal";
import React, { useEffect, useState } from "react";
import { addFaqApi } from "services/supportManagment";
import { toastMessage } from "utils/toastMessage";

const AddFaqModal = ({
  modalAdd,
  closeAndClear,
  onSuccess,
  editFaq,
  faqType = "seller",
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState({});

  // ---------------- input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- validation
  const validation = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------- reset
  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setError({});
    setIsEdit(false);
  };

  // ---------------- submit
  const addFaqFormSubmit = async (e) => {
    e.preventDefault();

    if (!validation()) return;

    const payload = {
      question: formData.title,
      answer: formData.description,
      type: editFaq?.type || faqType,
      ...(isEdit && { faqId: editFaq?._id }),
    };

    try {
      const res = await addFaqApi(payload);

      if (res?.status === 200) {
        toastMessage(res?.data?.message, "success");

        onSuccess();       // 🔥 refresh FIRST
        resetForm();
        closeAndClear();   // close AFTER
      }
    } catch (error) {
      toastMessage(error?.response?.data?.message, "error");
    }
  };

  // ---------------- edit fill
  useEffect(() => {
    if (editFaq) {
      setIsEdit(true);
      setFormData({
        title: editFaq.question || editFaq.title || "",
        description: editFaq.answer || editFaq.description || "",
      });
    } else {
      resetForm();
    }
  }, [editFaq]);

  return (
    <CustomModal
      className="Sent_notification_modal"
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>{isEdit ? "Edit FAQ" : "Add FAQ"}</h3>

      <div className="wrap_sent_notify">
        <div className="form_field">
          <Input
            name="title"
            placeholder="Enter Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          {error.title && <p style={{ color: "red" }}>{error.title}</p>}
        </div>

        <div className="form_field">
          <TextArea
            name="description"
            placeholder="Write Here..."
            value={formData.description}
            onChange={handleInputChange}
          />
          {error.description && <p style={{ color: "red" }}>{error.description}</p>}
        </div>

        <div className="button_wrap">
          <Button onClick={addFaqFormSubmit}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddFaqModal;
