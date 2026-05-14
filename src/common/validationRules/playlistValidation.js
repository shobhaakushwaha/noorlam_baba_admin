import { z } from "zod";

export const playlistValidate = (type) => {
  const allSchema = {
    addSongs: z.object({
      // ------------title
      title: z
        .string()
        .nonempty("Title is required")
        .min(2, "Title is too short")
        .max(50, "Title too long"),

      // ------------ songs (multi-select array)
      artistName: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .min(1, "Please select at least one song"),

      // ------------------genre (single select)
      genre: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .nullable()
        .refine((v) => v !== null, {
          message: "Please select a genre",
        }),

      // --------------------------mood (single select)
      mood: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .nullable()
        .refine((v) => v !== null, {
          message: "Please select a mood",
        }),

      // --------------------------profile image
      // profile: z
      //   .union([z.instanceof(File), z.string().url()])
      //   .optional()
      //   .refine(
      //     (file) =>
      //       !file ||
      //       typeof file === "string" ||
      //       ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      //     { message: "Invalid image type" }
      //   ),



      profile: z
  .any()
  .refine((val) => !!val, {
    message: "Cover image is required",
  })
  .refine(
    (val) => {
      // File upload
      if (val instanceof File) {
        return ["image/jpeg", "image/png", "image/webp"].includes(val.type);
      }

      // URL
      if (typeof val === "string") {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }

      return false;
    },
    {
      message: "Invalid image type or URL",
    }
  ),




    }),



    
  };

  return allSchema[type];
};