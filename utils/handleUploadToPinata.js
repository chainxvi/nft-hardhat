const { pinToPinata, uploadMetaDataToPinata } = require('../utils/uploadToPinata');

async function handleUploadToPinia() {
  const tokenUris = [];

  console.log('uploading to pinata...');
  const { responses, files } = await pinToPinata('./nft-assets/');
  for (const respIndex in responses) {
    const IpfsHash = responses[respIndex].IpfsHash;
    const metadata = {
      name: files[respIndex],
      description: 'a verifiably random ape',
      image: 'ipfs://' + IpfsHash,
      attributes : []
    };
    const metadataResponse = await uploadMetaDataToPinata(metadata);
    tokenUris.push(`ipfs://${metadataResponse.IpfsHash}`);
  }
  console.log('uploaded to pinata ✅');

  console.log(tokenUris);

  return tokenUris;
}

module.exports = {
  handleUploadToPinia,
};