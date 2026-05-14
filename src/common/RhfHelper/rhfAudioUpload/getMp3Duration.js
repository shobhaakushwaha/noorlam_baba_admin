export const getMp3Duration = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject("Not a file");
      return;
    }

    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.src = url;
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration); // seconds (float)
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject("Invalid or unsupported audio file");
    };
  });
};
