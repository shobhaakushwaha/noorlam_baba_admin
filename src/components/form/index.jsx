import React from "react";
import Rating from "react-rating";
import { FaMinus, FaPlus, FaRegStar, FaStar } from "react-icons/fa";
import { forwardRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import "react-phone-input-2/lib/style.css";
import MultiSelect from "react-select";
import { components } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Example icons
import PhoneInput from "react-phone-input-2";
import { CiSearch } from "react-icons/ci";
import { Form } from "react-bootstrap";

export const RatingStar = ({
  user = null,
  rating,
  readonly = false,
  onChange,
  ...rest
}) => {
  const handleChange = (value) => {
    const newValue = value; // Convert back to the desired increment value
    if (onChange) {
      onChange(newValue); // Update the rating
    }
  };

  return (
    <>
      <div className="rating">
        {/* <span className="_rating">{rating}</span> */}
        <Rating
          stop={rating}
          readonly={readonly}
          className="rating_star"
          emptySymbol={<FaRegStar />}
          fullSymbol={<FaStar />}
          fractions={1}
          onChange={readonly ? undefined : handleChange} // Update value only if not readonly
          {...rest}
        />
        {user && <span className="user">{user}</span>}
      </div>
    </>
  );
};

export const Input = forwardRef(
  (
    {
      value,
      onChange,
      className = "",
      label,
      error,
      required,
      extraError = false,
      infoErr = false,
      ...rest
    },
    ref
  ) => {
    const classNameGenerator = () => {
      if (infoErr && extraError) {
        return "is-invalid";
      }
      if (infoErr) {
        return "info";
      }
      return ((!value && error) || extraError) && "is-invalid";
    };

    // console.log(error,"Error");

    return (
      <>
        {label && (
          <label className="label">
            {label}
            {required && <span className="required mx-1"> *</span>}
          </label>
        )}
        <input
          value={value}
          onChange={onChange}
          className={`form-control input ${className} ${classNameGenerator()}`}
          {...rest}
          ref={ref}
        />
        {error && (
          <span className={`${infoErr ? "info-feedback" : "invalid-feedback"}`}>
            {error}
          </span>
        )}
      </>
    );
  }
);

export const Select = forwardRef(
  (
    {
      label,
      onChange,
      value,
      error,
      className = "",
      children,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <label className="label">
            {label}
            {required && <span className="required mx-1"> *</span>}
          </label>
        )}
        <select
          onChange={onChange}
          value={value}
          className={`form-control input${className} ${
            !value && error && "is-invalid"
          }`}
          {...rest}
          ref={ref}
        >
          {children}
        </select>
        {error && <span className="invalid-feedback">{error}</span>}
      </>
    );
  }
);

export const TextArea = forwardRef(
  ({ value, onChange, label, className = "", error, ...rest }, ref) => {
    return (
      <>
        {label && <label className="label my-1">{label}</label>}
        <textarea
          value={value}
          onChange={onChange}
          className={`form-control input${className} ${
            !value && error && "is-invalid"
          }`}
          ref={ref}
          {...rest}
        />
        {error && <span className="invalid-feedback">{error}</span>}
      </>
    );
  }
);

export const DatePicker = forwardRef(
  (
    {
      value,
      onChange,
      className = "",
      label,
      error,
      icon,
      required,
      placeholder="Select Date",
      extraError = false,
      infoErr = false,
      optional = false,
      ...rest
    },
    ref
  ) => {
    const classNameGenerator = () => {
      if (infoErr && extraError) {
        return "is-invalid";
      }
      if (infoErr) {
        return "info";
      }
      return ((!value && error) || extraError) && "is-invalid";
    };
    return (
      <>
        {label && (
          <label className="label">
            {label}
            {required && <span className="required mx-1"> *</span>}
            {optional && <em className="optional">{"(optional)"}</em>}
          </label>
        )}
        <ReactDatePicker
          ref={ref}
          className={`form-control input ${className} ${classNameGenerator()}`}
          showIcon
          icon={icon}
          selected={value}
          onChange={onChange}
          dateFormat="dd-MMM-yyyy"
          showMonthDropdown
          useShortMonthInDropdown
          showYearDropdown
          scrollableYearDropdown
          placeholderText={placeholder}
          onChangeRaw={(e) => e.preventDefault()}
          {...rest}
          yearDropdownItemNumber={300}
        />
        {!value && error && (
          <span
            className={`${
              infoErr ? "info-feedback" : "invalid-feedback"
            } d-block`}
          >
            {error}
          </span>
        )}
      </>
    );
  }
);

export const Button = ({
  className = "",
  type = "button",
  loading,
  children,
  isDisabled = false,
  ...rest
}) => {
  return (
    <>
      <button
        type={type}
        disabled={isDisabled}
        className={`button ${className} ${loading ? "loading" : ""}`}
        {...rest}
      >
        {loading ? (
          <svg
            id="eYhlmQsGXoB1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 495.398 495.398"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            className="loading_svg"
          >
            <g transform="matrix(.946299 0 0 0.946299 13.301708 13.301674)">
              <g>
                <g>
                  <path
                    d="M487.083,225.514l-75.08-75.08v-86.73c0-15.682-12.708-28.391-28.413-28.391-15.669,0-28.377,12.709-28.377,28.391v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158c11.087,11.101,29.089,11.101,40.172,0L236.194,77.943c6.115-6.083,16.893-6.083,22.976-.018L446.912,265.672c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312c11.086-11.086,11.086-29.053-.001-40.158Z"
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="20"
                    className="svg-elem-3"
                  ></path>
                  <path
                    d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159v-120.402c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836Z"
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="20"
                    className="svg-elem-4"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        ) : (
          children
        )}
      </button>
    </>
  );
};

export const CommonSelect = ({
  label,
  onChange,
  value,
  error,
  className = "",
  options = [],
  isMulti = false,
  isSearchable = false,
  noOptionsMessage = () => "No options found",
  required = false,
  loading = false,
  isDisabled = false,
  placeholder = "Select",
  ...rest
}) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? "#808080" : "#fff", // Change background color of selected option
      color: state.isSelected ? "#fff" : "#000", // Change text color of selected option
      "&:hover": {
        background: "#808080", // Change background color of option on hover
        color: "#fff", // Change text color of option on hover
      },
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: "#FF8989", // Set the color to red
    }),
  };

  const CustomDropdownIndicator = (props) => {
    const { menuIsOpen } = props.selectProps; // Access menu open state
    return (
      <components.DropdownIndicator {...props}>
        {menuIsOpen ? <FaChevronUp /> : <FaChevronDown />}
      </components.DropdownIndicator>
    );
  };

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const LoadingIndicator = (props) => {
    return (
      <components.LoadingIndicator {...props}>
        {/* <ClipLoader size={20} color="#999" loading={true} />
         */}
        <p>Loading...</p>
      </components.LoadingIndicator>
    );
  };

  const handleChange = (selectedOptions) => {
    onChange(selectedOptions);
  };

  // const handleMenuToggle = (state) => {
  //   setMenuOpen(state);
  // };

  return (
    <div>
      {label && <label className="label">{label}</label>}
      {required && <span className="text-danger"> *</span>}

      <MultiSelect
        onChange={handleChange}
        value={value}
        className={`form-control multi-select ${className} ${
          !value && error && "is-invalid"
        }`}
        classNamePrefix="select"
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        isSearchable={isSearchable}
        noOptionsMessage={noOptionsMessage}
        isLoading={loading}
        styles={customStyles}
        isDisabled={isDisabled}
        // classNamePrefix="react_select"
        // placeholderText={placeholder}
        components={{
          DropdownIndicator: CustomDropdownIndicator,
          LoadingIndicator: LoadingIndicator,
        }}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuIsOpen={menuIsOpen}
        {...rest}
      />
      {/* {leftIcon} */}

      {error && <span className="invalid-feedback d-flex">{error}</span>}
    </div>
  );
};

// Switch Button //
export const SwitchButton = ({
  className = "",
  status = false,
  disabled,
  ...rest
}) => {
  return (
    <>
      <label
        className={`switch_button ${className} ${disabled ? "disabled" : ""}`}
      >
        {/* <input type="checkbox" checked={status} disabled={disabled} {...rest} /> */}
        <input type="checkbox" checked={status} {...rest} />

        <span className="slider round"></span>
      </label>
    </>
  );
};

// Phone Input //
export const CountryInput = ({
  value,
  onChange,
  error = "",
  infoErr = "",
  ...rest
}) => {
  return (
    <>
      {" "}
      <div className="phone_input">
        <PhoneInput
          country={"us"}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
      {error && (
        <span
          className={`${
            infoErr ? "info-feedback" : "invalid-feedback"
          } d-block`}
        >
          {error}
        </span>
      )}
    </>
  );
};

// Counter //

export const NumberCount = () => {
  return (
    <div className="number_counter">
      <button type="button">
        <FaMinus />
      </button>
      <input type="number" />
      <button type="button">
        <FaPlus />
      </button>
    </div>
  );
};

// Search Component
export const Search = ({
  name,
  value,
  onChange,
  onClick = () => {},
  isIcon = false,
  children,
  onFocus = () => {},
  onBlur = () => {},
  onKeyDown = () => {},
  className,
}) => {
  return (
    <Form className="cstm_search" onSubmit={(e) => e.preventDefault()}>
      <div className={`wrap_seacrh_bar ${className}`}>
        {isIcon && (
          <div className="magnifier-wrapper">
            <CiSearch onClick={onClick} />
          </div>
        )}
        <Form.Control
          type="search"
          placeholder="Search..."
          className="me-2 input"
          aria-label="Search"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur} // Delay to allow clicking
          onKeyDown={onKeyDown}
        />
        {!isIcon && <CiSearch onClick={onClick} />}
      </div>
      {isIcon && children}
    </Form>
  );
};
