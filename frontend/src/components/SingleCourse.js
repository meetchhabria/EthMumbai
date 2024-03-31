import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IPFSJsonViewer from './IPFSJsonViewer';

const SingleCourse = () => {
  const { hash } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  useEffect(() => {
    // Fetch course details using the hash
    // Example fetch code:
    // fetchCourseDetails(hash)
    //   .then(details => {
    //     setCourseDetails(details);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching course details:', error);
    //   });
    // For this example, assuming course details are fetched and stored in state
    setCourseDetails({ title: 'Course Title', description: 'Course Description', hash });
  }, [hash]);

  const handleVideoClick = (index) => {
    setSelectedVideoIndex(selectedVideoIndex === index ? null : index);
  };

  return (
    <div>
      <h1>{courseDetails.title}</h1>
      <p>{courseDetails.description}</p>
      <div>
        <h3>Videos:</h3>
        <ul>
          {/* Display videos here */}
        </ul>
      </div>
      <IPFSJsonViewer ipfsHash={courseDetails.hash} />
    </div>
  );
};

export default SingleCourse;
