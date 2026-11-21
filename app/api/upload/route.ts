import { getServerSession } from "@/lib/session"

const MAX_FILE_SIZE = 5 * 1024 * 1024

type ImgbbResponse = {
  success?: boolean
  data?: {
    url?: string
    display_url?: string
    delete_url?: string
  }
  error?: {
    message?: string
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return Response.json(
      { error: "Please sign in before uploading an image." },
      { status: 401 }
    )
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim()

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Image upload is not configured. Add IMGBB_API_KEY to your environment.",
      },
      { status: 500 }
    )
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return Response.json(
      { error: "The uploaded file could not be read." },
      { status: 400 }
    )
  }

  const file = formData.get("image")

  if (!(file instanceof File)) {
    return Response.json({ error: "Please choose an image file." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Only image files are supported." },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Image must be smaller than 5 MB." },
      { status: 400 }
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadBody = new FormData()
    uploadBody.append("image", buffer.toString("base64"))
    uploadBody.append("name", file.name.replace(/\.[^.]+$/, "").slice(0, 64))

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadBody,
        cache: "no-store",
      }
    )

    const payload = (await response.json().catch(() => null)) as
      | ImgbbResponse
      | null

    const url = payload?.data?.url || payload?.data?.display_url

    if (!response.ok || !payload?.success || !url) {
      return Response.json(
        {
          error:
            payload?.error?.message ||
            "ImgBB could not upload that image. Please try again.",
        },
        { status: 502 }
      )
    }

    return Response.json({
      url,
      displayUrl: payload.data?.display_url ?? url,
      deleteUrl: payload.data?.delete_url ?? null,
    })
  } catch (error) {
    console.error("ImgBB upload failed", error)

    return Response.json(
      { error: "Image upload failed. Please check your connection and try again." },
      { status: 502 }
    )
  }
}
