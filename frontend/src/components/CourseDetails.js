import React, { useEffect, useState } from 'react';
import abi from './contracts/CourseContract.json';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';

const CourseEnrollmentAddress = "0x6cf542839d78b4916e4ed268cb95e2cec7f83b1b";

const CourseDetails = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState(null);
  const { hash } = useParams();

  useEffect(() => {
    async function initializeContract() {
      try {
        const { ethereum } = window;
        if (!ethereum || !ethereum.isMetaMask || !ethereum.isConnected()) {
          console.error("MetaMask or similar provider not detected. Please install MetaMask or use a compatible Ethereum provider.");
          return;
        }
        
        console.log("MetaMask detected.");
        
        ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        const defaultAccount = accounts[0];
        const contract = new web3.eth.Contract(
          abi.abi,
          CourseEnrollmentAddress,
          { from: defaultAccount }
        );

        setContractWithSigner(contract);
      } catch (error) {
        console.error("Error initializing Ethereum provider:", error);
      }
    }

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`https://indigo-prickly-guineafowl-860.mypinata.cloud/ipfs/${hash}`);
        const courseData = response.data;
    
        if (courseData && courseData.courseInfo && courseData.courseInfo.price) {
          setCourseDetails(courseData);
        } else {
          console.error('Invalid course data: Price information missing');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
    initializeContract();
  }, [hash]);

  const handleBuyButtonClick = () => {
    // Navigate to EnrolledCourseDetails with the course hash
    window.location.href = `/enrolled-course-details/${hash}`;
  };

  const handleBuyCourse = async (coursePrice, selectedCourseId) => {
    try {
      const { ethereum } = window;
      if (!ethereum || !ethereum.isMetaMask || !ethereum.isConnected()) {
        throw new Error("MetaMask or similar provider not detected. Please install MetaMask or use a compatible Ethereum provider.");
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const defaultAccount = accounts[0];

      // Get the user's balance
      const balance = await web3.eth.getBalance(defaultAccount);
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      const coursePriceInEther = web3.utils.toWei(coursePrice.toString(), 'ether');

      // Compare the course price with the user's balance
      if (Number(balanceInEther) < Number(coursePriceInEther)) {
        throw new Error("Insufficient balance to buy the course.");
      }

      // Prompt MetaMask to approve the transaction
      const options = {
        from: defaultAccount,
        value: coursePriceInEther
      };

      const contractWithSigner = new web3.eth.Contract(
        abi.abi,
        CourseEnrollmentAddress,
        { from: defaultAccount }
      );

      await contractWithSigner.methods.buyCourse(selectedCourseId).send(options);
      console.log('Course purchased successfully');
      // You can show a success message to the user here
    } catch (error) {
      console.error('Error buying course:', error);
      // You can show an error message to the user here
    }
  };


  return (
    <div style={styles.container}>
      {courseDetails ? (
        <div>
          <h2 style={styles.heading}>Course Details</h2>
          <div style={styles.detailsContainer}>
            <div style={styles.courseDescription}>
              <p>{courseDetails.id}</p>
              <p><strong>Name:</strong> {courseDetails.courseInfo.name}</p>
              <p><strong>Description:</strong> {courseDetails.courseInfo.description}</p>
            </div>
            <div style={styles.priceBlock}>
              <div style={styles.price}>
                <strong>Price:</strong> {courseDetails && courseDetails.courseInfo && courseDetails.courseInfo.price ? `$${courseDetails.courseInfo.price}` : 'Price not available'}
              </div>
              <button onClick={() => {
                handleBuyCourse(courseDetails.courseInfo.price, courseDetails.id);
                handleBuyButtonClick();
              }}>
                Buy Course
              </button>
            </div>
            <div>
              <h3>Videos:</h3>
              <ul style={styles.videoList}>
                {courseDetails.videos.map((video, index) => (
                  <li key={index} style={styles.videoItem}>
                    <div style={styles.videoTitle} onClick={() => setSelectedVideoIndex(selectedVideoIndex === index ? null : index)}>
                      {video.videoTitle} <span style={styles.arrow}>{selectedVideoIndex === index ? '▲' : '▼'}</span>
                    </div>
                    {selectedVideoIndex === index && (
                      <div style={styles.videoDetails}>
                        <p><strong>Description:</strong> {video.videoDescription}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
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

export default CourseDetails;
