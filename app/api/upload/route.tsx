import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const { path } = await request.json();

  if (!path) {
    return NextResponse.json(
      { message: "Image Path is invalid" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.upload(path);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
}
