import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./config.js";
const s3 = new S3Client({
    region: env.AWS_REGION
});
export async function createUploadUrl(imageKey, contentType) {
    if (!env.AWS_S3_BUCKET)
        throw new Error("AWS_S3_BUCKET is not configured");
    const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: imageKey,
        ContentType: contentType
    });
    return getSignedUrl(s3, command, { expiresIn: 300 });
}
