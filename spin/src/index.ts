import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  // Check if the request has a body
  if (request.body) {
    // Convert ArrayBuffer to string
    const bodyString = arrayBufferToString(request.body);

    // Generate MD5 hash of the request body
    const md5Hash = generateMD5Hash(bodyString);

    // Return the hash as the response
    return {
      status: 200,
      headers: { "content-type": "text/plain" },
      body: md5Hash,
    };
  } else {
    // If the request does not have a body, return a bad request response
    return {
      status: 400,
      headers: { "content-type": "text/plain" },
      body: "Bad Request: Request body is required.",
    };
  }
};

// Function to generate MD5 hash (simple implementation)
function generateMD5Hash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash.toString();
}

// Function to convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}
