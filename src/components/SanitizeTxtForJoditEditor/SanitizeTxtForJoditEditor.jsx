import DOMPurify from "dompurify";

export const SanitizeTxtForJoditEditor = ({ content }) => {
  const cleanHTML = DOMPurify.sanitize(content);

  return <span dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};
