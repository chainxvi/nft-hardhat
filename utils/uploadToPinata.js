const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function pinToPinata(filepath) {
  const fullPath = path.resolve(filepath);
  const files = fs.readdirSync(fullPath);
  let responses = [];
  
  for (const file in files) {
    const readableStreamForFile = fs.createReadStream(fullPath + '/' + files[file]);
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }

  return {responses, files};
}

async function uploadMetaDataToPinata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  pinToPinata,
  uploadMetaDataToPinata,
}