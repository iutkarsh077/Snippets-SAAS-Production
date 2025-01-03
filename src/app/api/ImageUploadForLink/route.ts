"use server";

import { CloudinaryUploadResult, uploadImageCloudinary } from "@/lib/cloudinaryImageUploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const formData = await req.formData();
    const image = formData.get("file") as File;
    revalidatePath("/explore");
    try {
        const CloudinaryImageLink = await uploadImageCloudinary(image, "posts") as CloudinaryUploadResult;

        const imageUrl = CloudinaryImageLink.url;
        return NextResponse.json({message: "Successfully Image uploaded", status: true, imageUrl}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Upload Failed", status: false}, {status: 401});
    }
}