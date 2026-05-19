import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, TextArea } from "components/form";
import ImageUpload from "components/imageupload/ImageUpload";
import RhfImageUpload from "components/imageupload/rhfImageUpload";
import CustomModal from "components/modals/CustomModal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addBrandApi } from "services/brandManagment";
import { toastMessage } from "utils/toastMessage";

const BrandModal = ({ modalAdd, closeAndClear, refreshList }) => {
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState({
    heading: "",
    description: "",
    image: null,
    // type: "",
  });

  const [formData, setformData] = useState({
    heading: "",
    description: "",
    image: null,
    // type: "",
  });
  //Add Brand
  const validation = () => {
    // debugger;
    let status = true;
    const error = {};
    console.log(error, "err");
    if (!formData.image) {
  error["image"] = "Cover image is required";
  status = false;
}
    if (!formData.heading) {
      error["heading"] = "Please Enter Heading";
      status = false;
    }
    if (!formData.description) {
      error["description"] = "Please Enter Description";
      status = false;
    }
    // if (!formData.type) {
    //   error["type"] = "Please Select Type";
    //   status = false;
    // }

    setError(error);
    return status;
  };

  const filesHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setformData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const resetForm = () => {
    setformData({
      heading: "",
      description: "",
      image: null,
      // type: "",
    });
  };

  const AddBrand = async (e) => {
    e.preventDefault();
      setSubmitted(true); // mark that form was submitted


    if (!validation()) return;

    try {
      const reqData = new FormData();
      reqData.append("title", formData.heading);
      reqData.append("description", formData.description);
      reqData.append("type",'home');

      if (formData.image) {
        reqData.append("image", formData.image);
      }
console.log(...reqData, "reqData");
      const res = await addBrandApi(reqData);

      if (res?.data?.status === 201) {
        closeAndClear();
        toastMessage(res.data.message);

        refreshList();
        resetForm();
              setSubmitted(false); 

      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setformData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const onChangeHandler = (e) => {
    let { name, value } = e.target;
    console.log(name, value);
    setformData({ ...formData, [name]: value });
  };

  return (
    <CustomModal
      className={"add_genre_modal"}
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>Add Brand</h3>

      <form onSubmit={AddBrand}>
     

        {/* <ImageUpload image={formData.image} onChange={handleImageChange} /> */}
        <ImageUpload 
  image={formData.image} 
  onChange={handleImageChange} 
  showError={submitted}  // 👈 move it here
/>

        {/* <div className="form_field">
          <Select
            name="type"
            value={formData.type}
            onChange={onChangeHandler}
            className="form_select input"
              showError={submitted} 

          >
                        <option value="">Select Type</option>

            <option value="all">All</option>
            <option value="home">Home</option>
            <option value="playlist">Playlist</option>
          </Select>
         

          {error.type && <p style={{ color: "red" }}>{error.type}</p>}
        </div> */}

     

        <div className="form_field">
          <Input
            placeholder="Enter here..."
            label="Top Heading"
            name="heading"
            value={formData.heading}
            onChange={onChangeHandler}
          />
          {error.heading && <p style={{ color: "red" }}>{error.heading}</p>}
        </div>
        <div className="form_field">
          <TextArea
            placeholder="Enter here.."
            value={formData.description}
            maxLength="50"
            name="description"
            label="Body Text  (Max 50 Characters)"
            onChange={onChangeHandler}
          />
          {error.description && (
            <p style={{ color: "red" }}>{error.description}</p>
          )}
        </div>
        <div className="button_wrap">
        

          <button className="button">Save</button>
        </div>
      </form>
    </CustomModal>
  );
};

export default BrandModal;
