import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import "./rhfScss.scss";

const SelectMultiSongSelect = ({
  control,
  error,
  isEdit = false,
  setValue,
  serviceDetails,
  name = "",
  options = [],
}) => {

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
          <label className="label">Select Songs  *</label>

          {/* <MultiSelect
            {...field}
            options={options || []}
            //   isSearchable
            labelledBy=" Select Moods"
            value={field.value || []}
            onChange={(opt) => field.onChange(opt)}
            onBlur={() => field.onBlur()}
          /> */}


<MultiSelect
  {...field}
  options={options || []}
  labelledBy="Select Song"
  value={field.value || []}
  onChange={(opt) => field.onChange(opt)}
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
export default SelectMultiSongSelect;
