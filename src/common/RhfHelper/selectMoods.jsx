import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectOptionsMoods = ({
  control,
  error,
  name = "",
  options = [],
}) => {
  return (
    <Controller
      name={name || "options"}
      control={control}
      render={({ field }) => (
        <div className="form_field">
          <label className="label">Select Mood*</label>

          <Select
            {...field}
            options={options || []}
            isSearchable
            placeholder="Select Moods"
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

export default SelectOptionsMoods;