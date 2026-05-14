import { zodResolver } from "@hookform/resolvers/zod";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { schemaValidate } from "common/validationRules/validationRules";
import { removeToken } from "config/axiosInstance";
import usePasswordToggle from "hooks/usePasswordToggle";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { changePasswordApi } from "services/changePassword";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";
import ImageUploads from "components/imageupload/ImageProfile";
import { profileDetailsData, profileUpdated } from "services/CategoryManagement";


const ProfileUpdate = () => {
      const [submitted, setSubmitted] = useState(false);
      const [profileDetails,setprofileDetalis]=useState([])
    
  const navigate = useNavigate();
  const [inputType, icon] = usePasswordToggle();
  const [errors, setErrors] = useState({
  name: "",
  mobile: "",
});
 
    const [formData, setformData] = useState({
      name: "",
      mobile: "",
      image: null,

    });

  // -----------------------react hook form

//   const {
//     register,
//     control,
//     handleSubmit,

//     formState: { errors, isValid, isDirty, touchedFields, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(schemaValidate("changePass")),
//     mode: "onChange", // IMPORTANT
//   });

//   const isSubmitEnabled = isDirty && isValid;



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

  // -------------------------------------submit
 const profileDetailsApi = async () => {
  try {
    const response = await profileDetailsData();

    if (response?.status === 200) {
      const data = response?.data?.data?.user; // adjust if structure different
 localStorage.setItem(
          "naksha_admin-detail",
          JSON.stringify(response?.data?.data?.user)
        );
      setformData({
        name: data?.name || "",
        mobile: data?.mobile || "",
        image: data?.profile || null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const validate = () => {
  let newErrors = { name: "", mobile: "" };
  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
    isValid = false;
  }

  if (!formData.mobile.trim()) {
    newErrors.mobile = "Mobile number is required";
    isValid = false;
  } else if (formData.mobile.length < 10) {
    newErrors.mobile = "Mobile number must be 10 digits";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};
  const doSubmit = async () => {
      setSubmitted(true);

  if (!validate()) return; 

// 
  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("mobile", formData.mobile);
    payload.append("profile", formData.image);

//   if (formData.profile) payload.append("image", formData.image);

  try {
    const response = await profileUpdated(payload);

    if (response?.status === 200) {
      toastMessage(response?.data?.message, "success");
      navigate("/dashboard");
    }
  } catch (error) {
    console.log(error);
  }
};

 useEffect (()=>{
  profileDetailsApi()

 },[])

  return (
    <>
      <div className="change_pass full-width">
        <div className="dashboard_title">
          <h3>Profile Update</h3>
        </div>
        <div className="card">
          <div className="form_details">
<form
  onSubmit={(e) => {
    e.preventDefault();
    doSubmit();
  }}
>              <div className="content">
                <div className="form_field has_icon password">
                  <label className="label"> Profile Picture</label>
                
                  <ImageUploads 
  image={formData.image} 
  onChange={handleImageChange} 
  showError={submitted}  
/>
                  {/* ------------for error message */}
                  {/* {errors?.oldPassword && (
                    <div className="validation_err">
                      <p>{errors?.oldPassword?.message}</p>
                    </div>
                  )} */}
                </div>
                <div className="form_field has_icon password">
                  <label className="label">Name</label>
                  <input
                    className="form-control input form-control input false"
                      onChange={onChangeHandler}

name="name"
                     value = {formData.name}
                    placeholder="Enter New Name"
                   
                  />

                   {errors.name && (
    <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
      {errors.name}
    </p>
  )}
                </div>
                <div className="form_field has_icon password">
                  <label className="label"> Mobile No.</label>
                  <input
                    className="form-control input form-control input"
                    name ="mobile"
                    maxLength={10}
                    value={formData.mobile}
                      onChange={onChangeHandler}

                    placeholder="Enter Mobile No."
                
                  />
              

                   {errors.mobile && (
    <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
      {errors.mobile}
    </p>
  )}
                </div>

                <div className="button_wrap">
                  {/* <button
                    type="submit"
                    className="button"
                    disabled={!isSubmitEnabled || isSubmitting}
                  >
                    {isSubmitting && bootstrapLoaderHelperFun()}
                    Update
                  </button> */}


                  


                     <button
                    type="submit"
                    className="button"
                  
                  >
                   
                    Update
                  </button>




                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
