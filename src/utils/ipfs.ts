'use server';

import { PinataSDK } from 'pinata-web3';

import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';
import { generateMetadata } from './metadata';

const PINATA_API_KEY = process.env.NEXT_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PINATA_SECRET_API_KEY;
const PINATA_JWT_KEY = process.env.NEXT_PINATA_JWT_KEY;

const PINATA_GATEWAY_CLOUD_URL = process.env
  .NEXT_PINATA_GATEWAY_CLOUD_URL as string;
const PINATA_UPLOAD_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const PINATA_METADATA_GROUP_ID = process.env
  .NEXT_PINATA_METADATA_GROUP_ID as string;
const PINATA_IMAGE_GROUP_ID = process.env.NEXT_PINATA_IMAGE_GROUP_ID as string;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT_KEY,
  pinataGateway: PINATA_GATEWAY_CLOUD_URL,
});

async function uploadToIPFS(fileBuffer: Buffer): Promise<string> {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Missing Pinata API keys in environment variables.');
  }

  // Convert WebP to PNG
  const pngBuffer = await sharp(fileBuffer).png().toBuffer();

  const blob = new Blob([pngBuffer], { type: 'image/png' });

  const file = new File([blob], 'guizia_nft.png', {
    type: 'image/png',
  });

  const response = await pinata.upload.file(file);

  if (!response.IpfsHash) {
    throw new Error(`IPFS upload failed: ${JSON.stringify(response)}`);
  }

  // Add to Pinata group folder
  const group = await pinata.groups.addCids({
    groupId: PINATA_IMAGE_GROUP_ID,
    cids: [response.IpfsHash],
  });

  return `ipfs://${response.IpfsHash}`;
}

export async function generateGuiziaMetadata() {
  const imageData = await generateMetadata();
  const imageUrl = imageData.output;

  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();

  const imageIpfsPath = await uploadToIPFS(Buffer.from(imageBuffer));

  const metadata = {
    attributes: [{ value: 'ColorBlue', trait_type: 'Background' }],
    description: 'Guizia NFT Description.',
    image: imageIpfsPath,
    name: 'Guizia NFT Name',
  };

  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Missing Pinata API keys in environment variables.');
  }

  const formData = new FormData();
  formData.append('file', Buffer.from(JSON.stringify(metadata)), {
    filename: 'guizia_nft_metadata.json',
    contentType: 'application/json',
  });

  const metadataResponse = await axios.post(PINATA_UPLOAD_URL, formData, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
      ...formData.getHeaders(),
    },
  });

  // Add to Pinata metadata group folder
  const group = await pinata.groups.addCids({
    groupId: PINATA_METADATA_GROUP_ID,
    cids: [metadataResponse.data.IpfsHash],
  });

  return `ipfs://${metadataResponse.data.IpfsHash}`;
}
