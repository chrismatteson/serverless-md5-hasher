const crypto = require('crypto');

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: '',
  };

  // Check if the request has a body
  if (event.body) {
    // Generate MD5 hash of the request body
    const md5Hash = generateMD5Hash(event.body);

    // Set the hash as the response body
    response.body = md5Hash;
  } else {
    // If the request does not have a body, return a bad request response
    response.statusCode = 400;
    response.body = 'Bad Request: Request body is required.';
  }

  return response;
};

// Function to generate MD5 hash
function generateMD5Hash(data) {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

