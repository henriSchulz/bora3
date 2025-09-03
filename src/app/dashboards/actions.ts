"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 5; // In MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Type for form state

export type FormState = {
  message: string;
  errors?: {
    dashboardName?: string[];
    file?: string[];
  };
};

// Schema for form validation
const DashboardSchema = z.object({
    dashboardName: z
        .string("Dashboard name is required.")
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(50, { message: "Name must be at most 50 characters long." }),
    file: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, "Please upload a schematic image file.")
        .refine(
            (file) => file && file.size <= MAX_FILE_SIZE * 1024 * 1024,
            `Max image size is ${MAX_FILE_SIZE}MB.`
        )
        .refine(
            (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
});

// Action to create a new dashboard and handle form submission
export async function createDashboard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Extract form data
  const file = formData.get("new-dashboard-schematic");
  const dashboardName = formData.get("new-dashboard-name");

  // 2. Validate the data using your schema
  const validatedFields = DashboardSchema.safeParse({
    dashboardName,
    file,
  });

  // 3. If validation fails, return errors
  if (!validatedFields.success) {
    return {
      message: "Input Error: Please correct the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    file: validatedFile,
    dashboardName: validatedName,
  }: { file: File; dashboardName: string } = validatedFields.data;

  // 1. Convert the file to a Buffer
  const bytes = await validatedFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save file with unique name in /public/uploads
  const fileExtension = path.extname(validatedFile.name);
  const randomFileID = crypto.randomUUID();
  const fileName = `${randomFileID}${fileExtension}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const filePath = path.join(uploadDir, fileName);
  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
  } catch (error) {
    return {
      message: "Error: Could not save the uploaded file.",
      errors: {
        file: ["Could not save the uploaded file. Please try again."],
      },
    };
  }

  

  try {
    await prisma.dashboard.create({
      data: {
        name: validatedName,
        schematicImagePath: `/uploads/${fileName}`,
      },
    });
    
    // Revalidate the dashboards page to show the new dashboard
    revalidatePath("/dashboards");
  } catch (error) {
    return {
      message: "Error: Could not create dashboard.",
      errors: {
        dashboardName: ["Could not create dashboard. Please try again."],
      },
    };
  }

  return { message: "Dashboard created successfully!" };
}
