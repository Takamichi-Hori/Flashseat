import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    
    region: "ap-northeast-1"
});

const command = new PutObjectCommand({

    Bucket:
      process.env.AWS_S3_BUCKET,

    Key: "imageKey",

    ContentType: contentType
});

const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });


