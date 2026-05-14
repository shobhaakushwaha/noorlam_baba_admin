export const firstWordCapital = (str) => {
  if (typeof str !== "string" || !str.trim()) {
    return str; // Return as is if it's not a valid string
  }

  const [firstWord, ...rest] = str.trim().split(" ");
  return `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} ${rest.join(
    " "
  )}`;
};

export const getValueOrFallback = (...values) => {
  if (!values?.length) return "NA";
  const result = values
    .filter((value) => value && String(value)?.trim())
    .join(" ")
    .trim();
  return result || "NA";
};

export const capitalizeAndJoin = (words, separator = ",") => {
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(separator);
};

export const isObjectEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const isArrayEmpty = (array) => {
  return Array.isArray(array) && array.length === 0;
};

export const formatCurrency = (value, currency = "SAR", locale = "ar-SA") => {
  if (isNaN(value)) return "Invalid value";

  return `${value} ${currency}`;
};

export const formatArrayWithSeparator = (array, separator = ", ") => {
  if (!Array.isArray(array) || array.length === 0) {
    return "";
  }
  return array.filter(Boolean).join(separator); // Join values with the provided separator
};

export const secondsToMinutes = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid Input";
  }
  return (seconds / 60).toFixed(2); // Returns up to 2 decimal places
};
