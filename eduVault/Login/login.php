<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    $conn = new mysqli('localhost', 'root', '', 'udemy_platform');

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $row['role']; // Store user's role in session
            header("Location: dashboard_redirect.php"); // Redirect to dashboard redirection page
            exit();
        } else {
            echo "Invalid password";
        }
    } else {
        echo "User not found";
    }

    $conn->close();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="login-container">
    <h2>Login</h2>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <input type="text" name="username" placeholder="Username" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <input type="submit" name="login" value="Login">
        <button id="metamask-login">Login with MetaMask</button>
    </form>
    <p class="center-text">Don't have an account? <a href="register.php">Sign Up here</a></p>
</div>
<script>
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    
    // Add event listener to login button
    document.getElementById('metamask-login').addEventListener('click', async function() {
        try {
            // Request access to the user's MetaMask accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Log the Ethereum address
            console.log('Connected Ethereum address:', accounts[0]);
            // Redirect to a backend endpoint to handle the login with Ethereum address
            window.location.href = 'dashboard_redirect.php?ethereumAddress=' + accounts[0];
        } catch (error) {
            console.error(error);
            alert('Failed to connect to MetaMask. Please make sure MetaMask is installed and logged in.');
        }
    });
} else {
    console.log('MetaMask is not installed.');
    // Disable the button or provide alternative login method if MetaMask is not installed
    document.getElementById('metamask-login').disabled = true;
}
</script>

</body>
</html>
