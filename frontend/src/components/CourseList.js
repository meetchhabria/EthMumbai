import React, { useState, useEffect } from 'react';
import IPFSJsonViewer from './IPFSJsonViewer';
import { fetchJsonHashes } from './PinataUtils';
// import { Link } from 'react-router-dom';

const CourseList = () => {
  const [ipfsHashes, setIpfsHashes] = useState([]);

  useEffect(() => {
    fetchJsonHashes()
      .then(jsonHashes => {
        setIpfsHashes(jsonHashes);
      })
      .catch(error => {
        console.error('Error fetching JSON hashes:', error);
      });
  }, []);

  const handleBuyClick = (hash) => {
    // Redirect to the course page with the corresponding hash
    window.location.href = `/course/${hash}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Course List</h1>
      <div style={styles.courseContainer}>
        {ipfsHashes.map((hash, index) => (
          <div key={index} style={styles.courseLink}>
            <div style={styles.courseBlock}>
              <IPFSJsonViewer ipfsHash={hash} />
              {/* <button style={styles.buyButton} onClick={() => handleBuyClick(hash)}>Buy</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    color: '#333',
  },
  courseContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px',
  },
  courseLink: {
    textDecoration: 'none',
    width: 'calc(33.33% - 20px)', // Adjusted to accommodate 3 blocks per row with 20px gap
    marginBottom: '20px', // Added margin bottom to create space between rows
  },
  courseBlock: {
    width: '100%',
    height: '200px',
    padding: '20px',
    borderRadius: '8px',
    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns items with space between them
    flexDirection: 'column',
  },
  
};

export default CourseList;



