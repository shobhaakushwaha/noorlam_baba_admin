import { z } from "zod";

export const schemaValidate = (type) => {
  const allSchema = {
    login: z.object({
      userEmail: z
        .string()
        .trim()
        .nonempty("Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format"),

      userPassword: z
        .string()
        .trim()
        .nonempty("Password is required")
        .regex(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
          "Password must contain 8+ chars, 1 uppercase, 1 number, 1 special character"
        ),
    }),

    forgotPassword: z.object({
      userEmail: z
        .string()
        .trim()
        .nonempty("Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format"),
    }),

    setNewPassword: z
      .object({
        userPassword: z
          .string()
          .trim()
          .nonempty("Password is required")
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            "Password must contain 8+ chars, 1 uppercase, 1 number, 1 special character"
          ),

        confirmPass: z.string().trim().nonempty("Confirm password is required"),
      })
      .refine((data) => data.userPassword === data.confirmPass, {
        path: ["confirmPass"],
        message: "Passwords do not match",
      }),

    // ---------------------------------------category part

    addCategorySchema: z.object({
      playListName: z
        .string()
        .nonempty("Name is required")
        .min(2, "Name is too short")
        .max(50, "Name too long"),

      image: z
        .any()

        .refine((file) => file instanceof File, {
          message: "Image is required",
        })
        .refine((file) => !file || file.size <= 6 * 1024 * 1024, {
          message: "Image must be less than 6MB",
        })
        .refine(
          (file) =>
            !file ||
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          {
            message: "Invalid image type",
          }
        ),
    }),
    editCategorySchema: z.object({
      playListName: z.string().nonempty("Name is required").min(2).max(50),

      image: z
        .union([z.instanceof(File), z.string().url(), z.undefined()])
        .optional(),
    }),
    // ----------------------------change pass
    changePass: z
      .object({
        oldPassword: z
          .string()
          .trim()
          .nonempty("Password is required")
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            "Password must contain 8+ chars, 1 uppercase, 1 number, 1 special character"
          ),
        currentPassword: z
          .string()
          .trim()
          .nonempty("Password is required")
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            "Password must contain 8+ chars, 1 uppercase, 1 number, 1 special character"
          ),
        confirmPass: z.string().trim().nonempty("Confirm password is required"),
      })
      .refine((data) => data.currentPassword === data.confirmPass, {
        path: ["confirmPass"],
        message: "Passwords do not match",
      }),
  };

  return allSchema[type];
};
