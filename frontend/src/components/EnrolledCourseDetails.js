import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Web3 from 'web3'; // Import Web3 library
import abi from './contracts/CourseContract2.json'
import { ethers } from 'ethers';


const contractAddress = '0xc58b33510e77b40014f74b4f89215ecdf48a1ee1';

const EnrolledCourseDetails = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false); // State to track course completion
  const [completionStatus, setCompletionStatus] = useState(''); // State to track user selection
  const [contractWithSigner, setContractWithSigner] = useState(null); // State to store contract instance
  const [web3, setWeb3] = useState(null); // State to store Web3 instance
  const { hash } = useParams(); // Extract the hash parameter from the URL

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`https://indigo-prickly-guineafowl-860.mypinata.cloud/ipfs/${hash}`);
        setCourseDetails(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    const initializeContract = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum || !ethereum.isMetaMask || !ethereum.isConnected()) {
          throw new Error("MetaMask or similar provider not detected. Please install MetaMask or use a compatible Ethereum provider.");
        }

        ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const provider = new Web3.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        const contractwsigner = contract.connect(signer);
        setContractWithSigner(contractwsigner);
        setWeb3(new Web3(provider));
      } catch (error) {
        console.error("Error initializing Ethereum provider:", error);
      }
    };

    fetchCourseDetails();
    initializeContract();
  }, [hash]);

  const handleMarkCourseCompletion = async () => {
    // Assuming user has selected the completion status before marking it as completed
    if (completionStatus === '') {
      alert('Please select completion status.');
      return;
    }
  
    try {
      // Check if contract instance is available
      if (!contractWithSigner) {
        console.error('Contract instance not available.');
        return;
      }
  
      // Get the current Ethereum account
      const accounts = await web3.eth.getAccounts();
      const currentUser = accounts[0];
  
      // Call the function to mark course completion
      await contractWithSigner.markCourseCompletion(currentUser, courseDetails.id);
  
      setCourseCompleted(true);
    } catch (error) {
      console.error('Error marking course completion:', error);
    }
  };

  const handleClaimFunds = async () => {
    try {
      // Check if contract instance is available
      if (!contractWithSigner) {
        console.error('Contract instance not available.');
        return;
      }
  
      // Get the current Ethereum account
      const accounts = await web3.eth.getAccounts();
      const currentUser = accounts[0];
  
      // Call the function to withdraw funds
      await contractWithSigner.withdrawFunds(currentUser, courseDetails.id);
  
      alert('Funds claimed successfully!');
    } catch (error) {
      console.error('Error claiming funds:', error);
    }
  };

  const handleStatusChange = (event) => {
    setCompletionStatus(event.target.value);
  };

  const handleVideoClick = (index) => {
    setSelectedVideoIndex(selectedVideoIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enrolled Course Details</h2>
      {courseDetails ? (
        <div style={styles.detailsContainer}>
          <div style={styles.courseDescription}>
            <p><strong>ID:</strong> {courseDetails.id}</p>
            <p><strong>Name:</strong> {courseDetails.courseInfo.name}</p>
            <p><strong>Description:</strong> {courseDetails.courseInfo.description}</p>
          </div>
          <div>
            <h3>Videos:</h3>
            <ul style={styles.videoList}>
              {courseDetails.videos.map((video, index) => (
                <li key={index} style={styles.videoItem}>
                  <div style={styles.videoTitle} onClick={() => handleVideoClick(index)}>
                    {video.videoTitle} <span style={styles.arrow}>{selectedVideoIndex === index ? '▲' : '▼'}</span>
                  </div>
                  {selectedVideoIndex === index && (
                    <div style={styles.videoDetails}>
                      <p><strong>Description:</strong> {video.videoDescription}</p>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Video:</strong>
                        <video controls style={{ maxWidth: '100%', marginTop: '5px' }}>
                          <source src={`https://indigo-prickly-guineafowl-860.mypinata.cloud/ipfs/${video.ipfsHash}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label>
              Select completion status:
              <select value={completionStatus} onChange={handleStatusChange}>
                <option value="">Select...</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </label>
          </div>
          {courseCompleted ? (
            <button onClick={handleClaimFunds}>Claim Funds</button>
          ) : (
            <button onClick={handleMarkCourseCompletion}>Mark Course Completed</button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      marginBottom: '20px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#333',
    },
    detailsContainer: {
      maxWidth: '800px',
      width: '90%',
    },
    courseDescription: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    priceBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    price: {
      fontWeight: 'bold',
    },
    buyButton: {
      padding: '10px 20px',
      backgroundColor: '#61dafb',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    videoList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'left',
    },
    videoItem: {
      borderBottom: '1px solid #ccc',
      transition: 'background-color 0.3s',
    },
    videoTitle: {
      cursor: 'pointer',
      padding: '10px 20px',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    arrow: {
      marginLeft: '10px',
    },
    videoDetails: {
      padding: '10px 20px',
      backgroundColor: '#f5f5f5',
    },
  };
  

export default EnrolledCourseDetails;
