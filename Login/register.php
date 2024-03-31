<?php
// Check if form is submitted for registration
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    // Establish connection to MySQL database
    $conn = new mysqli('localhost', 'root', '', 'udemy_platform');

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Get form data
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password
    $role = $_POST['role'];
    $wallet = $_POST['wallet'];

    // Insert user data into database
    $sql = "INSERT INTO users (username, password, role, wallet) VALUES ('$username', '$password', '$role', '$wallet')";
    if ($conn->query($sql) === TRUE) {
        echo "Registration successful";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close database connection
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="styles_registration.css">
</head>
<body>

<div>
    <h2>Sign Up</h2>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <input type="text" name="username" placeholder="Username" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <select name="role" required>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="instructor">Instructor</option>
        </select><br>
        <input type="text" name="wallet" placeholder="MetaMask Wallet" required><br>
        <input type="submit" name="register" value="Register">
    </form>
    <p>Already have an account? <a href="login.php">Login here</a></p>
</div>

</body>
</html>
