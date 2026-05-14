import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectOptionsArtist = ({
  control,
  error,
  isEdit = false,
  name = "",
  options = [],
}) => {
 

  useEffect(() => {
    if (isEdit) {
      setValue(
        "options",
        options.find((o) => o.value === serviceDetails?.category)
      );
    }
  }, [isEdit]);

  return (
    <Controller
      name={name || "options"}
      control={control}
      render={({ field }) => (
        <div className="form_field">
          <label className="label">Select Artist *</label>

          <Select
            {...field}
            options={options || []}
            isSearchable
            placeholder="Select Artist"
            noOptionsMessage={() => "No option found"}
            value={field.value}
            onChange={(opt) => field.onChange(opt)}
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

export default SelectOptionsArtist;
