import { z } from "zod";

export const contentManagementValidate = (type) => {
  const allSchema = {
    addSongs: z.object({
      // -------audio
      audio: z
        .union([z.instanceof(File), z.string().url()])
        .nullable()
        .optional()
        .refine(
          (file) => {
            if (!file) return false;
            if (typeof file === "string") return true;
            return file.size <= 50 * 1024 * 1024;
          },
          { message: "Audio file is required" }
        )
        .refine(
          (file) => {
            if (!file || typeof file === "string") return true;
            return ["audio/mpeg", "audio/wav", "audio/flac"].includes(
              file.type
            );
          },
          { message: "Only MP3, WAV, or FLAC files are allowed" }
        ),

      // ------------title
      title: z
        .string()
        .nonempty("Title is required")
        .min(2, "Title is too short")
        .max(50, "Title too long"),

      // ------------artist  ✅ Changed
      artistName: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .nullable()
        .refine((v) => v !== null, {
          message: "Please select an artist",
        }),

      // ------------------genre  ✅ Changed
      genre: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .nullable()
        .refine((v) => v !== null, {
          message: "Please select a genre",
        }),

      // --------------------------mood
      mood: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .min(1, "Select at least one mood"),

      // -------profile/cover image
      profile: z
        .union([z.instanceof(File), z.string().url()])
        .nullable()
        .optional()
        .refine(
          (file) => {
            if (!file) return false;
            if (typeof file === "string") return true;
            return true;
          },
          { message: "Cover image is required" }
        )
        .refine(
          (file) => {
            if (!file || typeof file === "string") return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(
              file.type
            );
          },
          { message: "Invalid image type" }
        ),
    }),
  };

  return allSchema[type];
};