<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

// Check if the user is a student
if ($_SESSION['role'] != 'user') {
    echo "Access Denied: You are not authorized to view this page.";
    exit();
}

// Fetch courses from the database (replace this with your actual code to fetch courses)
$dummy_courses = array(
    array("id" => 1, "title" => "Course 1", "image" => "course1.jpg"),
    array("id" => 2, "title" => "Course 2", "image" => "course2.jpg"),
    array("id" => 3, "title" => "Course 3", "image" => "course3.jpg")
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    <style>
        /* Add your CSS styles here */
    </style>
</head>
<body>

<div class="dashboard-container">
    <h2>Welcome, <?php echo $_SESSION['username']; ?> (Student)</h2>
    
    <h3>List of Courses:</h3>
    <div class="course-list">
        <?php foreach ($dummy_courses as $course): ?>
            <div class="course-card">
                <a href="course_details.php?id=<?php echo $course['id']; ?>">
                    <img src="<?php echo $course['image']; ?>" alt="<?php echo $course['title']; ?>">
                    <h4><?php echo $course['title']; ?></h4>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
</div>

</body>
</html>
