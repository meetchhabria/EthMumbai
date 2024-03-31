// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseContract {
    address payable public owner;
    address payable public instructor;
    uint256 public coursePrice;
    uint256 public thresholdTime;
    mapping(address => uint256) public userFunds;
    mapping(address => bool) public courseCompletion;

    struct Course {
        uint256 noOfEnrolledUsers;
        mapping(address => bool) enrolled;
        mapping(address => bool) hasEnrolled;
        mapping(uint256 => address) enrolledStudents; // Mapping from course ID to enrolled student's address
    }

    mapping(uint256 => Course) public courses;

    event CoursePurchased(address indexed buyer, uint256 amount);
    event CourseCompleted(address indexed user, bool completed);
    event Enroll(address indexed student, uint256 courseId);

    // constructor(uint256 _coursePrice, uint256 _thresholdTime) {
    //     instructor = payable(msg.sender);
    //     coursePrice = _coursePrice;
    //     thresholdTime = _thresholdTime;
    // }

    constructor() {
        owner = payable (msg.sender);
    }

    modifier onlyInstructor() {
        require(msg.sender == instructor, "Only instructor can call this function");
        _;
    }

    function buyCourse(uint256 _courseId) external payable {
    require(msg.value >= coursePrice, "Insufficient funds to buy the course");

    // Split funds between user and instructor
    uint256 amountToUser = (msg.value * 30) / 100;
    uint256 amountToInstructor = (msg.value * 68 ) / 100 ;
    uint256 platformFees = msg.value - amountToInstructor - amountToUser;

    userFunds[msg.sender] += amountToUser;
    emit CoursePurchased(msg.sender, msg.value);

    // Send funds to instructor
    payable(instructor).transfer(amountToInstructor);
    payable(owner).transfer(platformFees);

    // Enroll user in the course
    enroll(_courseId);
}

    function enroll(uint256 _courseId) internal {
        require(!courses[_courseId].hasEnrolled[msg.sender], "Already enrolled");

        // Increment the number of enrolled users for this course
        courses[_courseId].noOfEnrolledUsers++;

        // Mark the sender as enrolled for this course
        courses[_courseId].enrolled[msg.sender] = true;
        courses[_courseId].hasEnrolled[msg.sender] = true;

        // Store the enrolled student's address for the given course ID
        courses[_courseId].enrolledStudents[_courseId] = msg.sender;

        emit Enroll(msg.sender, _courseId);
    }

    function checkCourseCompletion(uint256 /* _courseId */, uint256 timeWatched) external {
    if (timeWatched >= thresholdTime) {
        courseCompletion[msg.sender] = true;
        emit CourseCompleted(msg.sender, true);
    } else {
        courseCompletion[msg.sender] = false;
        emit CourseCompleted(msg.sender, false);
    }
}


    function withdrawFunds() external {
        require(courseCompletion[msg.sender], "Course not completed yet");
        uint256 amountToSend = userFunds[msg.sender];
        require(amountToSend > 0, "No funds available for withdrawal");
        userFunds[msg.sender] = 0;
        payable(msg.sender).transfer(amountToSend);
    }

    // function withdrawInstructorFunds() external onlyInstructor {
    //     uint256 amountToSend = address(this).balance;
    //     require(amountToSend > 0, "No funds available for withdrawal");
    //     instructor.transfer(amountToSend);
    // }

    function isEnrolled(uint256 _courseId, address _student) external view returns (bool) {
        return courses[_courseId].enrolled[_student];
    }

    function getEnrolledUsers(uint256 _courseId) external view returns (uint256) {
        return courses[_courseId].noOfEnrolledUsers;
    }

    function getEnrolledStudent(uint256 _courseId) external view returns (address) {
        return courses[_courseId].enrolledStudents[_courseId];
    }
}