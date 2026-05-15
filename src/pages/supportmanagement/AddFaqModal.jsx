import { Button, Input, Select, TextArea } from "components/form";
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
    question: "",
    answer: "",
    type: faqType || "seller",
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

    if (!formData.question.trim()) errors.question = "Question is required";
    if (!formData.answer.trim()) errors.answer = "Answer is required";
    if (!formData.type) errors.type = "Type is required";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------- reset
  const resetForm = () => {
    setFormData({ question: "", answer: "", type: faqType || "seller" });
    setError({});
    setIsEdit(false);
  };

  // ---------------- submit
  const addFaqFormSubmit = async (e) => {
    e.preventDefault();

    if (!validation()) return;

    const payload = {
      question: formData.question,
      answer: formData.answer || "",
      type: editFaq?.type || formData.type,
      ...(isEdit && editFaq?._id && { faqId: editFaq._id }),
    };

    try {
      const res = await addFaqApi(payload);
      const isSuccess =
        [200, 201].includes(res?.status) ||
        [200, 201].includes(res?.data?.status);

      if (isSuccess) {
        toastMessage(res?.data?.message, "success");

        onSuccess();
        resetForm();
        closeAndClear();
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
        question: editFaq.question || "",
        answer: editFaq.answer || "",
        type: editFaq.type || faqType || "seller",
      });
    } else {
      resetForm();
    }
  }, [editFaq, faqType]);

  return (
    <CustomModal
      className="Sent_notification_modal"
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>{isEdit ? "Edit FAQ" : "Add FAQ"}</h3>

      <div className="wrap_sent_notify">
        <div className="form_field">
          <Select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            disabled={isEdit}
          >
            <option value="seller">Seller</option>
            <option value="user">User</option>
            <option value="logistic">Logistic</option>
          </Select>
          {error.type && <p style={{ color: "red" }}>{error.type}</p>}
        </div>

        <div className="form_field">
          <Input
            name="question"
            placeholder="Enter question"
            value={formData.question}
            onChange={handleInputChange}
          />
          {error.question && <p style={{ color: "red" }}>{error.question}</p>}
        </div>

        <div className="form_field">
          <TextArea
            name="answer"
            placeholder="Write Here..."
            value={formData.answer}
            onChange={handleInputChange}
          />
          {error.answer && <p style={{ color: "red" }}>{error.answer}</p>}
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
