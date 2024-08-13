// The following libraries are included in the lambda runtime and should not be packaged:
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { Handler } from 'aws-lambda';

import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  return 'Hello, World!' + uuidv4();
};

// Example usage of AWS libraries.
const createPresignedPutUrlWithClient = (expirationSeconds: number, { region, bucket, key }: any) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client as any, command as any, { expiresIn: expirationSeconds });
};
