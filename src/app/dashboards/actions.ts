"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile, mkdir, unlink } from "fs/promises";
import fs from "fs";
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



// Schema for form validation
const CreateDashboardSchema = z.object({
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

const RenameDashboardSchema = z.object({
    newName: z
        .string("Dashboard name is required.")
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(50, { message: "Name must be at most 50 characters long." }),
});




// Action to create a new dashboard and handle form submission
export async function createDashboard(
  formData: FormData
): Promise<{success: boolean; errors: string[]}> {
  // 1. Extract form data
  const file = formData.get("new-dashboard-schematic");
  const dashboardName = formData.get("new-dashboard-name");

  // 2. Validate the data using your schema
  const validatedFields = CreateDashboardSchema.safeParse({
    dashboardName,
    file,
  });

  // 3. If validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors.dashboardName || [""],
    }
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
      success: false,
      errors: ["Could not upload the file. Please try again."],
    };
  }

  

  try {
    // check if the name is already taken
    const existingDashboard = await prisma.dashboard.findUnique({
      where: { name: validatedName },
    });

    if (existingDashboard) {
        return {
        success: false,
        errors: ["Dashboard name is already taken. Please choose another name."],
      };
  }


    await prisma.dashboard.create({
      data: {
        name: validatedName,
        schematicImagePath: `/uploads/${fileName}`,
      },
    });
    
    // Revalidate the dashboards page to show the new dashboard
    revalidatePath("/dashboards");
    return { success: true, errors: [] };
    //redirect("/dashboards");
  } catch (error) {
    console.log(error);
    // delete the uploaded file if database operation fails

    try {
      if(fs.existsSync(filePath)) await unlink(filePath);
    } catch (fsError) {
      console.log("Failed to delete the uploaded file after DB error:", fsError);
    }

    return {
      success: false,
      errors: ["Could not create dashboard: Database error. Please try again."],
    }
  }

}

export async function deleteDashboard(dashboardId: string): Promise<{success: boolean; errors: string[]}> {
  try {
    // Find the dashboard to get the image path
    const dashboard = await prisma.dashboard.findUnique({
      where: { id: dashboardId },
    });

    if (!dashboard) {
      return { success: false, errors: ["Could not delete dashboard. Please refresh and try again."] };
    }

    const imagePath = dashboard.schematicImagePath;

    // Delete the dashboard from the database
    await prisma.dashboard.delete({
      where: { id: dashboardId },
    });
    
    // Delete the associated image file if it exists
    if (imagePath) {
      const fullImagePath = path.join(process.cwd(), "public", imagePath);
      try {
        if(fs.existsSync(fullImagePath)) await unlink(fullImagePath);
      } catch (fsError) {
        console.log("Failed to delete the dashboard image file:", fsError);
      }
    }
    // Revalidate the dashboards page to reflect the deletion
    revalidatePath("/dashboards");
    
    // Todo: Delete corresponding widgets amd sensors when implemented

    return { success: true, errors: [] };

  } catch (error) {
    console.log(error);
    return { success: false, errors: ["Could not delete dashboard. Please refresh and try again."] };
  }
}

export async function renameDashboard(dashboardId: string, newName: string): Promise<{success: boolean; errors: string[]}> {

  // 1. Validate the new name
  const validatedFields = RenameDashboardSchema.safeParse({
    newName,
  });

  // 2. If validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors.newName || [""],
    }
  }

  const { newName: validatedName }: { newName: string } = validatedFields.data;

  try {
    // check if the name is already taken
    const existingDashboard = await prisma.dashboard.findUnique({
      where: { name: validatedName },
    });

    if (existingDashboard) {
        return {
        success: false,
        errors: ["Dashboard name is already taken. Please choose another name."],
      };
  }

    // Update the dashboard name in the database
    await prisma.dashboard.update({
      where: { id: dashboardId },
      data: { name: validatedName },
    });

    // Revalidate the dashboards page to reflect the name change
    revalidatePath("/dashboards");

    return { success: true, errors: [] };

}
  catch (error) {
    console.log(error);
    return { success: false, errors: ["Could not rename dashboard. Please refresh and try again."] };
  }
}
  
