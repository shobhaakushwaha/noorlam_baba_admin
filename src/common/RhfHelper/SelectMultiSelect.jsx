import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import "./rhfScss.scss";

const SelectMultiSelect = ({
  control,
  error,
  isEdit = false,
  setValue,
  serviceDetails,
  name = "",
  options = [],
}) => {
  // const options = [
  //   { label: "Grapes 🍇", value: "grapes" },
  //   { label: "Mango 🥭", value: "mango" },
  //   { label: "Strawberry 🍓", value: "strawberry" },
  // ];

  useEffect(() => {
    if (isEdit && serviceDetails?.categories?.length) {
      const selectedOptions = options.filter((opt) =>
        serviceDetails.categories.includes(opt.value)
      );

      setValue("multiSelect", selectedOptions);
    }
  }, [isEdit, serviceDetails]);

  return (
    <Controller
      className="width-full"
      name={name || "multiSelect"}
      control={control}
      render={({ field }) => (
        <div className="form_field">
          <label className="label">Select Moods * (Select up to 3 moods that fit your song.
)</label>
           {/* <p className="mood-description">
        Select up to 3 moods that fit your song.
      </p> */}

      {/* <p className="mood-description">
  Select up to <span className="highlight-text">3 moods</span> that fit your song.
</p> */}

          {/* <MultiSelect
            {...field}
            options={options || []}
            //   isSearchable
            labelledBy=" Select Moods"
            value={field.value || []}
            onChange={(opt) => field.onChange(opt)}
            onBlur={() => field.onBlur()}
          /> */}


{/* <MultiSelect
  {...field}
  options={options || []}
  labelledBy="Select Moods"
  value={field.value || []}
  onChange={(opt) => field.onChange(opt)}
  onBlur={() => field.onBlur()}
  className="multi-select-full"
/> */}

<MultiSelect
  {...field}
  options={options || []}
  labelledBy="Select Moods"
  value={field.value || []}
    hasSelectAll={false}   // ✅ hides "Select All"

  onChange={(opt) => {
    if (opt.length <= 3) {
      field.onChange(opt);
    }
  }}
  onBlur={() => field.onBlur()}
  className="multi-select-full"
/>

          {error && (
            <div className="validation_err">
              <p className="error">{error.message}</p>
            </div>
          )}
        </div>
      )}
    />
  );
};
export default SelectMultiSelect;
