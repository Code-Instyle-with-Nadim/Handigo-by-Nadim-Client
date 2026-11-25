import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid image format" },
        { status: 400 }
      );
    }

    // Validate image size (5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 5MB" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMAGE_BB_API_KEY;
    const apiUrl = process.env.IMAGE_BB_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { success: false, message: "ImgBB configuration missing" },
        { status: 500 }
      );
    }

    const imgbbFormData = new FormData();

    imgbbFormData.append("image", image);

    const response = await fetch(
      `${apiUrl}?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { success: false, message: "Image upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    });

  } catch (error) {
    console.error("ImgBB Upload Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}