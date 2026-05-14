import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectOptions = ({
  control,
  error,
  isEdit = false,
  name = "",
  options = [],
}) => {
  // const options = [
  //   { label: "Grapes 🍇", value: "grapes" },
  //   { label: "Mango 🥭", value: "mango" },
  //   { label: "Strawberry 🍓", value: "strawberry" },
  // ];

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
          <label className="label">Select Genres *</label>

          <Select
            {...field}
            options={options || []}
            isSearchable
            placeholder="Select Genres"
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

export default SelectOptions;
