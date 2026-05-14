export const helperFunForNa = (req) => {
  if (req === null || req === undefined) return "NA";

  return req.toString()?.length > 0 && req ? req : "NA ";
};

// -------------fortamt number

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "0";

  const num = Number(value);
  if (isNaN(num)) return "0";

  return num.toLocaleString("en-IN"); // "1,50,000" style
};

export function formatBytes(value, decimals = 2) {
  // 1. Guard clauses — ruthless, no mercy
  if (value === null || value === undefined) return "0 Bytes";

  const bytes = Number(value);

  if (Number.isNaN(bytes) || bytes < 0) return "Invalid size";

  if (bytes === 0) return "0 Bytes";

  // 2. Units (extendable)
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  // 3. Calculate index
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));

  // 4. Clamp index (safety for huge numbers)
  const safeIndex = Math.min(unitIndex, units.length - 1);

  // 5. Convert
  const converted = bytes / Math.pow(1024, safeIndex);

  // 6. Format output
  return `${parseFloat(converted.toFixed(decimals))} ${units[safeIndex]}`;
}

// --------------------------open documents in new tab

export const handleDownload = (url) => {
  if (!url) return;
  window.open(url, "_blank");

  // if (!url) return;
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = getFileNameFromUrl(url); // auto filename
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};

export const helperFunForArrayNa = (req) => {
  if (req === null || req === undefined) return "NA";

  return req && req?.length > 0 && req ? req : "NA ";
};
