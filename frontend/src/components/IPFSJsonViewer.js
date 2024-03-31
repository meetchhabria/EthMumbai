import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IPFSJsonViewer = ({ ipfsHash }) => {
  const [courseInfo, setCourseInfo] = useState(null);
  const [error, setError] = useState(null);
  const handleBuyClick = (hash) => {
    // Redirect to the course page with the corresponding hash
    window.location.href = `/course/${hash}`;
  };

  useEffect(() => {
    // Fetch JSON data from IPFS
    axios.get(`https://indigo-prickly-guineafowl-860.mypinata.cloud/ipfs/${ipfsHash}`)
      .then(response => {
        setCourseInfo(response.data.courseInfo);
      })
      .catch(error => {
        setError(error);
      });
  }, [ipfsHash]);

  return (
    <div style={styles.card}>
      {error && <p style={styles.error}>Error fetching course data: {error.message}</p>}
      {courseInfo && (
        <>
          <h3>{courseInfo.name}</h3>
          <p>{courseInfo.description}</p>
          <p>Instructor: {courseInfo.instructor}</p>
          <p>Price: {courseInfo.price}</p> {/* Display the price */}
          <button style={styles.buyButton} onClick={() => handleBuyClick(ipfsHash)}>Buy</button>
        </>
      )}
      {!courseInfo && <p>Loading...</p>}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px', // Add margin between cards
    width: '300px', // Adjust card width as needed
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
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
};

export default IPFSJsonViewer;


