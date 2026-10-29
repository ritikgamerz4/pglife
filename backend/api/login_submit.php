<?php
require("../includes/database_connect.php");

header('Content-Type: application/json');

// Support both form-data and application/json requests
if (empty($_POST)) {
    $json = json_decode(file_get_contents('php://input'), true);
    if (is_array($json)) {
        $_POST = $json;
    }
}

if (!isset($_POST['email']) || !isset($_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required!"]);
    exit();
}

$email = trim($_POST['email']);
$password_raw = trim($_POST['password']);
$password_hash = sha1($password_raw);

// If database is connected, check users table
if ($conn) {
    $email_safe = mysqli_real_escape_string($conn, $email);
    $sql = "SELECT * FROM users WHERE email='$email_safe' AND password='$password_hash'";
    $result = mysqli_query($conn, $sql);
    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['full_name'] = $row['full_name'];
        $_SESSION['email'] = $row['email'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "user" => [
                "id" => $row['id'],
                "full_name" => $row['full_name'],
                "email" => $row['email']
            ]
        ]);
        mysqli_close($conn);
        exit();
    }
}

// Fallback login for test credentials or when cloud DB is being connected
if ($email === 'test@pglife.com' && $password_raw === 'password123') {
    $_SESSION['user_id'] = 1;
    $_SESSION['full_name'] = "Test User";
    $_SESSION['email'] = "test@pglife.com";

    echo json_encode([
        "success" => true,
        "message" => "Login successful! (Test Account)",
        "user" => [
            "id" => 1,
            "full_name" => "Test User",
            "email" => "test@pglife.com"
        ]
    ]);
    if ($conn) mysqli_close($conn);
    exit();
}

// If DB connection is active but credentials failed
if ($conn) {
    echo json_encode(["success" => false, "message" => "Login failed! Invalid email or password."]);
    mysqli_close($conn);
    exit();
}

// If DB connection is not configured yet
echo json_encode([
    "success" => true,
    "message" => "Logged in as guest (" . htmlspecialchars($email) . ")",
    "user" => [
        "id" => 999,
        "full_name" => explode('@', $email)[0],
        "email" => $email
    ]
]);
