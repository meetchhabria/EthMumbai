import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import CourseList from './components/CourseList';
import CourseDetails from './components/CourseDetails';
import EnrolledCourseDetails from './components/EnrolledCourseDetails'; // Import EnrolledCourseDetails component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route exact path="/" element={<CourseList />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:hash" element={<CourseDetails />} />
          <Route path="/enrolled-course-details/:hash" element={<EnrolledCourseDetails />} /> Use EnrolledCourseDetails component
        </Routes>
      </div>
    </Router>
  );
}

export default App;
