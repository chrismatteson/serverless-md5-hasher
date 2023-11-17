import { app, InvocationContext, HttpResponseInit, HttpRequest } from "@azure/functions";
import * as crypto from "crypto";

export default async function md5(
  context: InvocationContext,
  req: HttpRequest
): Promise<HttpResponseInit> {
  // Check if the request has a body
  if (req.body) {
    // Generate MD5 hash of the request body
    const md5Hash = await streamToString(req.body).then(generateMD5Hash);

    // Return the hash as the response
    return {
      status: 200,
      body: md5Hash,
    };
  } else {
    // If the request does not have a body, return a bad request response
    return {
      status: 400,
      body: "Bad Request: Request body is required.",
    };
  }
};

// Function to generate MD5 hash
function generateMD5Hash(data: string): string {
  const hash = crypto.createHash("md5");
  hash.update(data);
  return hash.digest("hex");
}

function streamToString(stream): Promise<string> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => {
      chunks.push(chunk);
    });
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}


