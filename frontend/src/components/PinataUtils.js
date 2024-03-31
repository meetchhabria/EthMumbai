import axios from 'axios';

// Your Pinata API credentials
const apiKey = '2d170e0d4e48b9438722';
const apiSecret = '8652225b4b249cadf1ee1259543f3dc1a14bc49e0b55eeb2fb805894c1b13c75';

// Function to list all files in Pinata manager
async function listAllFiles() {
  try {
    const response = await axios.get('https://api.pinata.cloud/data/pinList?status=pinned', {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': apiSecret
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error listing files from Pinata:', error);
    throw error;
  }
}

// Function to filter JSON files' hashes from the list of files
export function fetchJsonHashes() {
  return new Promise((resolve, reject) => {
    listAllFiles()
      .then(response => {
        const files = response.rows;
        if (Array.isArray(files)) {
          const jsonHashes = files.filter(file => file.mime_type === 'application/json').map(file => file.ipfs_pin_hash);
          resolve(jsonHashes);
        } else {
          reject(new Error('Invalid response from Pinata API'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

