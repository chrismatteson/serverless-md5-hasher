const crypto = require('crypto');

exports.httpFunction = (req, res) => {
  // Check if the request has a body
  if (req.body) {
    // Generate MD5 hash of the request body
    const md5Hash = generateMD5Hash(req.body);

    // Send the hash as the response
    res.status(200).send(md5Hash);
  } else {
    // If the request does not have a body, return a bad request response
    res.status(400).send('Bad Request: Request body is required.');
  }
};

// Function to generate MD5 hash
function generateMD5Hash(data) {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

