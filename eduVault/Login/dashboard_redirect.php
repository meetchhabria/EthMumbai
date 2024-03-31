<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

if ($_SESSION['role'] == 'user') {
    header("Location: student_dashboard.php");
    exit();
} elseif ($_SESSION['role'] == 'instructor') {
    header("Location: instructor_dashboard.php");
    exit();
} else {
    echo "Unknown role";
    exit();
}
?>
