<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

// Fetch course details based on the course ID from the URL (replace this with your actual code to fetch course details)
$course_id = isset($_GET['id']) ? $_GET['id'] : null;
$course_details = array(
    "course_title" => "Course Title",
    "instructor_name" => "Instructor Name",
    "description" => "Course Description",
    "image" => "course_image.jpg", // Update with the actual image URL
    "rating_star" => 4.5, // Update with the actual rating
    "rating_count" => 100 // Update with the actual count
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Details</title>
    <style>
        /* Add your CSS styles here */
    </style>
</head>
<body>

<div class="course-details-container">
    <h2><?php echo $course_details['course_title']; ?></h2>
    <div class="course-image">
        <img src="<?php echo $course_details['image']; ?>" alt="<?php echo $course_details['course_title']; ?>">
    </div>
    <div class="course-info">
        <p><strong>Instructor:</strong> <?php echo $course_details['instructor_name']; ?></p>
        <p><strong>Description:</strong> <?php echo $course_details['description']; ?></p>
        <p><strong>Rating:</strong> <?php echo $course_details['rating_star']; ?> (<?php echo $course_details['rating_count']; ?>)</p>
    </div>
</div>

</body>
</html>
