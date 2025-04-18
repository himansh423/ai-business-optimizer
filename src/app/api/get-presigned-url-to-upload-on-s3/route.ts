import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type Category = "exterior" | "interior" | "productImages";

type UploadFile = {
  name: string;
  type: string;
};

export async function POST(req: Request) {
  try {
    const {
      exterior = [],
      interior = [],
      productImages = [],
    }: {
      exterior: UploadFile[];
      interior: UploadFile[];
      productImages: UploadFile[];
    } = await req.json();

    const allFiles: (UploadFile & { category: Category })[] = [
      ...exterior.map((file) => ({
        ...file,
        category: "exterior" as Category,
      })),
      ...interior.map((file) => ({
        ...file,
        category: "interior" as Category,
      })),
      ...productImages.map((file) => ({
        ...file,
        category: "productImages" as Category,
      })),
    ];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: "No files provided." },
        { status: 400 }
      );
    }

    const uploads = await Promise.all(
      allFiles.map(async (file) => {
        const uniqueId = nanoid();
        const key = `uploads/${file.category}-${uniqueId}-${file.name}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          ContentType: file.type,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 60,
        });

        return {
          uploadUrl,
          key,
          originalFileName: file.name,
          category: file.category,
        };
      })
    );

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs." },
      { status: 500 }
    );
  }
}
