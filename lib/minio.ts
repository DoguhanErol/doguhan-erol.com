import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { extractMediaKeyFromUrl, getMediaPublicBase } from "./media-url";

function getS3Client() {
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const endpoint = `${useSsl ? "https" : "http"}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

  return new S3Client({
    endpoint,
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
      secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    },
    forcePathStyle: true,
  });
}

function bucketName() {
  return process.env.MINIO_BUCKET_NAME || "portfolio";
}

export function getPublicUrl(key: string): string {
  return `${getMediaPublicBase()}/${key}`;
}

export async function ensureBucket() {
  const client = getS3Client();
  const bucket = bucketName();
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
  }
}

export async function uploadToMinio(
  key: string,
  buffer: Buffer,
  contentType = "image/webp"
): Promise<string> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return getPublicUrl(key);
}

export async function deleteFromMinio(key: string): Promise<void> {
  const client = getS3Client();
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName(),
        Key: key,
      })
    );
  } catch {
    // missing object
  }
}

export function extractKeyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return extractMediaKeyFromUrl(url);
}
