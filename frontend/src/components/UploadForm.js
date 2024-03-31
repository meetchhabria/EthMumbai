import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [courseInfo, setCourseInfo] = useState({
    id: '', // Remove the initial value
    name: '',
    description: '',
    instructor: '',
    price: ''
  });

  const [counter, setCounter] = useState(1);
  const [videos, setVideos] = useState([{ file: null, description: '', title: '', ipfsHash: '' }]);
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateImageUrl, setCertificateImageUrl] = useState('');

  const pinataApiKey = '2d170e0d4e48b9438722';
  const pinataSecretApiKey = '8652225b4b249cadf1ee1259543f3dc1a14bc49e0b55eeb2fb805894c1b13c75';
  const tokenApiKey = 'd740944f196de1f86a5b';
  const tokenApiSecret = 'f2a39fa5d82162d61dd6937ea0b8b8c3453c2651dbcd38971891c63a60e6c0eb';

  const handleAddVideo = () => {
    setVideos([...videos, { file: null, description: '', title: '', ipfsHash: '' }]);
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handleFileChange = (event, index) => {
    const newVideos = [...videos];
    newVideos[index].file = event.target.files[0];
    setVideos(newVideos);
  };

  const handleDescriptionChange = (event, index) => {
    const newVideos = [...videos];
    newVideos[index].description = event.target.value;
    setVideos(newVideos);
  };

  const handleTitleChange = (event, index) => {
    const newVideos = [...videos];
    newVideos[index].title = event.target.value;
    setVideos(newVideos);
  };

  const handleImageChange = (event) => {
    setCertificateImage(event.target.files[0]);
  };

  const handleCourseIDChange = (event) => {
    const { value } = event.target;
    setCourseInfo({ ...courseInfo, id: value });
  };

  const handleCourseInfoChange = (event) => {
    const { name, value } = event.target;
    setCourseInfo({ ...courseInfo, [name]: value });
  };

  const generateID = () => {
    const newID = counter.toString();
    setCounter(counter + 1);
    return newID;
  };

  const uploadToIPFS = async (video) => {
    try {
      const formData = new FormData();
      formData.append('file', video.file);
      formData.append('description', video.description);
      formData.append('title', video.title);
      formData.append('courseName', courseInfo.name); 

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey,
        },
      });

      if (response && response.data && response.data.IpfsHash) {
        return response.data.IpfsHash;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      return null;
    }
  };

  const uploadCertificateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', certificateImage);
  
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': tokenApiKey,
          'pinata_secret_api_key': tokenApiSecret,
        },
      });
  
      if (response && response.data && response.data.IpfsHash) {
        const certificateImageHash = response.data.IpfsHash;
  
        // Construct JSON object containing the hash of the certificate image
        const certificateJsonData = {
          certificateHash: certificateImageHash
        };
  
        // Upload the JSON data to Pinata IPFS
        const certificateJsonResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', certificateJsonData, {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': tokenApiKey,
            'pinata_secret_api_key': tokenApiSecret,
          },
        });
  
        if (certificateJsonResponse && certificateJsonResponse.data && certificateJsonResponse.data.IpfsHash) {
          const certificateJsonHash = certificateJsonResponse.data.IpfsHash;
          // Now you have the hash of the JSON containing the hash of the certificate image
          console.log("Certificate JSON Hash:", certificateJsonHash);
          // Proceed with your logic to use this hash as needed
        } else {
          console.error('Failed to upload certificate JSON.');
          alert('Failed to upload certificate JSON. Please try again.');
        }
        
        setCertificateImageUrl(certificateImageHash);
        alert('Certificate image uploaded successfully.');
        return certificateImageHash;
      } else {
        alert('Failed to upload certificate image. Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading certificate image:', error);
      alert('Failed to upload certificate image. Please try again.');
      return null;
    }
  };
  
  
  const uploadAllToIPFS = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request access to user accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0]; // Get the first account address
  
        const updatedVideos = await Promise.all(videos.map(async (video) => {
          const ipfsHash = await uploadToIPFS(video);
          return { ...video, ipfsHash };
        }));
  
        // Upload certificate image and get its hash
        const certificateJSONHash = await uploadCertificateImage();
  
        // Construct JSON object
        const data = {
          id: courseInfo.id, // Use the manually entered course ID
          courseInfo: {
            name: courseInfo.name,
            description: courseInfo.name,
            instructor: courseInfo.instructor,
            price: courseInfo.price,
          },
          instructor: {
            name: courseInfo.instructor,
            wallet: walletAddress // Use wallet address from MetaMask
          },
          videos: updatedVideos.map(({ description, title, ipfsHash }) => ({
            courseName: courseInfo.name,
            courseDescription: courseInfo.description,
            instructor: courseInfo.instructor,
            courseFile: {}, // Placeholder, replace with actual course file data
            videoTitle: title,
            videoDescription: description,
            ipfsHash
          })),
          enrolled: [],
          certificateJSONHash: certificateJSONHash
        };
  
        // Upload JSON to IPFS
        const jsonData = JSON.stringify(data);
        const ipfsHashData = await uploadJsonToIPFS(jsonData, courseInfo.name);
  
        if (ipfsHashData) {
          alert('JSON data uploaded successfully to IPFS. IPFS Hash: ' + ipfsHashData);
          setCounter(counter + 1);
        } else {
          alert('Error uploading JSON data to IPFS.');
        }
      } else {
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error uploading files to IPFS:', error);
      alert('Error uploading files to IPFS. Please try again.');
    }
  };

  const uploadJsonToIPFS = async (jsonData, courseName) => {
    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey,
        },
      });

      if (response && response.data && response.data.IpfsHash) {
        return response.data.IpfsHash;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error uploading JSON data to IPFS:', error);
      return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload Videos to IPFS</h1>
      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Course ID:</label>
          <input type="text" name="id" value={courseInfo.id} onChange={handleCourseIDChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>Course Name:</label>
          <input type="text" name="name" value={courseInfo.name} onChange={handleCourseInfoChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>Course Description:</label>
          <textarea name="description" value={courseInfo.description} onChange={handleCourseInfoChange} style={styles.textarea} />
        </div>
        <div style={styles.inputGroup}>
          <label>Instructor Name:</label>
          <input type="text" name="instructor" value={courseInfo.instructor} onChange={handleCourseInfoChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>Price:</label>
          <input type="text" name="price" value={courseInfo.price} onChange={handleCourseInfoChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>Certificate Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
        </div>
        {certificateImageUrl && (
          <div style={styles.imagePreview}>
            <p>Uploaded Certificate Image:</p>
            <img src={`https://gateway.pinata.cloud/ipfs/${certificateImageUrl}`} alt="Certificate" style={styles.image} />
          </div>
        )}
        <button onClick={handleAddVideo} style={styles.button}>Add Video</button>
        {videos.map((video, index) => (
          <div key={index} style={styles.videoContainer}>
            <h2>Video {index + 1}</h2>
            <input type="file" accept="video/*" onChange={(event) => handleFileChange(event, index)} style={styles.fileInput} />
            <input type="text" placeholder="Description" value={video.description} onChange={(event) => handleDescriptionChange(event, index)} style={styles.input} />
            <input type="text" placeholder="Title" value={video.title} onChange={(event) => handleTitleChange(event, index)} style={styles.input} />
            <button onClick={() => handleRemoveVideo(index)} style={styles.removeButton}>Remove</button>
            {video.ipfsHash && <p>IPFS Hash: {video.ipfsHash}</p>}
          </div>
        ))}
      </div>
      <button onClick={uploadAllToIPFS} style={styles.uploadButton}>Upload All to IPFS</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontSize: '16px',
  },
  fileInput: {
    marginTop: '5px',
    fontSize: '16px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '15px',
  },
  removeButton: {
    display: 'inline-block',
    padding: '8px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
  videoContainer: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '15px',
  },
  imagePreview: {
    marginTop: '20px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
  },
  uploadButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default UploadForm;
