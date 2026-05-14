export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  imageFileRegex: /\.(jpg|jpeg|png|bmp)$/i,
  documentFileRegex: /\.(pdf|doc|docx|txt)$/i,
  excelFileRegex: /\.(xlsx|xls)$/i,
  audioFileRegex: /\.(mp3|wav|flac|m4a|aac|ogg)$/i,
  videoFileRegex: /\.(mp4|avi|mov|mkv|wmv|flv|webm)$/i,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*~^&+=!]).{8,}$/,
  youtubeLinkRegex:
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\w+\/|(?:v|e(?:mbed)?)\/|\w+\/)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  extractYoutubeLink:
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  panRegex: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
};

export function optimizeFunction(value) {
  return value.replace(/(^\s+)|([^A-Za-z\s])|(\s+)/g, " ").trimStart();
}

export function allowNumber(value) {
  return value.replace(/[^\d]/g, "").trimStart();
}

export const findSerialNumber = (index = 0, activePage = 1, limit = 10) => {
  return (activePage - 1) * limit + index + 1;
};

// Function to convert HTML to plain text
const stripHtmlAndStyles = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Function to apply character limit without counting HTML tags or styles
export const charLimit = (html, limit) => {
  const plainText = stripHtmlAndStyles(html); // Remove HTML tags and styles
  return plainText?.length > limit
    ? plainText.substring(0, limit + 1) + "..." || "---"
    : plainText;
};
