import { Button, DatePicker, Input, TextArea } from "components/form";
import CustomModal from "components/modals/CustomModal";
import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import { addNotificationApi } from "services/notification";
import { checkInOutTo24HrFormat, formatDates } from "utils/dateFormat";
import { failedMessage, toastMessage } from "utils/toastMessage";

const SentNotificationModal = ({ modalAdd, closeAndClear }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  // 🔹 FORM STATE
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    isSchedule: false,
    scheduledDate: "",
    scheduledTime: "",
    userType: "all",
  });

  const [error, setError] = useState({
    title: "",
    message: "",
    isSchedule: "",
    scheduledDate: "",
    scheduledTime: "",
  });

  const validation1 = () => {
    let status = true;
    const errors = {};

    if (!formData.title.trim()) {
      status = false;
      errors.title = "Title is required";
    }

    if (!formData.message.trim()) {
      status = false;
      errors.message = "Description  is required";
    }
    //  Conditional validation
    if (formData.isSchedule) {
      if (!formData.scheduledDate) {
        status = false;
        errors.scheduledDate = "Scheduled Date is required";
      }

      if (!formData.scheduledTime) {
        status = false;
        errors.scheduledTime = "Scheduled Time is required";
      }
    }

    setError(errors);
    return status;
  };

  const validation = () => {
    let status = true;
    const errors = {};

    if (!formData.title.trim()) {
      status = false;
      errors.title = "Title is required";
    }

    if (!formData.message.trim()) {
      status = false;
      errors.message = "Description is required";
    }

    // ✅ required only when scheduled tab
    if (tab === "scheduledDate") {
      if (!formData.scheduledDate) {
        status = false;
        errors.scheduledDate = "Scheduled Date is required";
      }

      if (!formData.scheduledTime) {
        status = false;
        errors.scheduledTime = "Scheduled Time is required";
      }
    }

    setError(errors);
    return status;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addNotificationFormSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      userType: formData.userType,
      title: formData.title,
      message: formData.message,
      isScheduled: formData.isSchedule,
      // scheduledTime: checkInOutTo24HrFormat(formData.scheduledTime)
      //   ? checkInOutTo24HrFormat(formData.scheduledTime)
      //   : "",
        scheduledTime: formData.scheduledTime || "",  // already "HH:mm" format

      scheduledAt: formatDates(formData.scheduledDate)
        ? formatDates(formData.scheduledDate)
        : formatDates(new Date()),
    };

    if (validation()) {
      try {
        const { data, status } = await addNotificationApi(payload);
        if (status === 201) {
          toastMessage(data.message || "Notification Added Successfully");

          setFormData({
            title: "",
            message: "",
            isSchedule: false,
            scheduledDate: "",
            scheduledTime: "",
            userType: "all",
          });

          closeAndClear();
        }
      } catch (err) {
        toastMessage(err?.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <CustomModal
      className={"Sent_notification_modal md"}
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>Sent Notification</h3>

      <div className="wrap_sent_notify">
        <form action="">
          <div className="form_field">
            <Input
              label="Title (max 25 alphabets)"
              name="title"
              max="25"
              value={formData.title}
              placeholder="Enter Title"
              onChange={handleInputChange}
            ></Input>

            {error.title && <p style={{ color: "red" }}>{error.title}</p>}
          </div>
          <div className="form_field">
            <label className="label" htmlFor="">
              Select User Type
            </label>
            <ul className="cstm_check_ul">
              <li>
                <span>All</span>
                <input
                  type="checkbox"
                  checked={formData.userType === "all"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, userType: "all" }))
                  }
                />
              </li>

              <li>
                <span>Only Users</span>
                <input
                  type="checkbox"
                  checked={formData.userType === "user"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, userType: "user" }))
                  }
                />
              </li>

              <li>
                <span>Only Seller</span>
                <input
                  type="checkbox"
                  checked={formData.userType === "artist"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, userType: "artist" }))
                  }
                />
              </li>
            </ul>
          </div>
          <div className="form_field">
            <TextArea
              label="Description"
              name="message"
              placeholder="Enter Description"
              value={formData.message}
              onChange={handleInputChange}
            ></TextArea>
            {error.message && <p style={{ color: "red" }}>{error.message}</p>}
          </div>

          {tab === "scheduledDate" && (
            <>
              {/* Checkbox auto checked */}
              <div className="form_field">
                <div className="wrap_flex">
                  <span>Scheduled Notification</span>

                  <div className="wrap_checkbox">
                    <input type="checkbox" checked readOnly />
                    <span>Schedule</span>
                  </div>
                </div>
              </div>

              {/* Always show date/time */}
              <div className="form_field_wrap">
                {/* Date */}
                <div className="form_field">
                  <DatePicker
                    icon={<LuCalendarDays />}
                    label="Select Date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    minDate={new Date()}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduledDate: value,
                        isSchedule: true, // force schedule
                      }))
                    }
                  />
                  {error.scheduledDate && (
                    <p style={{ color: "red" }}>{error.scheduledDate}</p>
                  )}
                </div>

                {/* Time */}
                <div className="form_field">
                  <label htmlFor="">Select Time</label>
{/* Time */}
<div className="form_field">
  {/* <label htmlFor="">Select Time</label> */}
  <div
    style={{ position: "relative", width: "100%" }}
    onClick={(e) => {
      const input = e.currentTarget.querySelector('input[type="time"]');
      if (input) input.showPicker();
    }}
  >
    <input
      type="time"
      name="scheduledTime"
      value={formData.scheduledTime}
      style={{
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
      }}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          scheduledTime: e.target.value,
          isSchedule: true,
        }))
      }
    />
  </div>
  {error.scheduledTime && (
    <p style={{ color: "red" }}>{error.scheduledTime}</p>
  )}
</div>              {/* <DatePicker
                    icon={<FaRegClock />}
                    label="Select Time"
                    selected={formData.scheduledTime}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    onChange={(time) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduledTime: time,
                        isSchedule: true,
                      }))
                    }
                  /> */}
                  {error.scheduledTime && (
                    <p style={{ color: "red" }}>{error.scheduledTime}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="button_wrap">
            <Button onClick={addNotificationFormSubmit}>Send Now</Button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default SentNotificationModal;
