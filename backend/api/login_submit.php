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

$email = mysqli_real_escape_string($conn, trim($_POST['email']));
$password = sha1(trim($_POST['password']));

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = mysqli_query($conn, $sql);
if (!$result) {
    echo json_encode(["success" => false, "message" => "Something went wrong! " . mysqli_error($conn)]);
    exit();
}

$row_count = mysqli_num_rows($result);
if ($row_count == 0) {
    echo json_encode(["success" => false, "message" => "Login failed! Invalid email or password."]);
    exit();
}

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
