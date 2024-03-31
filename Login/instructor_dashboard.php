<?php
session_start();

// Check if the user is logged in and is an instructor
if (!isset($_SESSION['username']) || $_SESSION['role'] != 'instructor') {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructor Dashboard</title>
    <link rel="stylesheet" href="./styles.css"> <!-- Assuming you have a CSS file for styling -->
</head>
<body>

<div class="dashboard-container">
    <h2>Welcome, <?php echo $_SESSION['username']; ?> (Instructor)</h2>
    <!-- Add other content specific to the instructor dashboard -->
</div>
<div class="button">
    <button class="button" onclick="window.location.href = 'http://localhost:3001/';">Add a course</button>
</div>

</body>
</html>
