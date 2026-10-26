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

$full_name = isset($_POST['full_name']) ? mysqli_real_escape_string($conn, trim($_POST['full_name'])) : '';
$phone = isset($_POST['phone']) ? mysqli_real_escape_string($conn, trim($_POST['phone'])) : '';
$email = isset($_POST['email']) ? mysqli_real_escape_string($conn, trim($_POST['email'])) : '';
$password = isset($_POST['password']) ? sha1(trim($_POST['password'])) : '';
$college_name = isset($_POST['college_name']) ? mysqli_real_escape_string($conn, trim($_POST['college_name'])) : '';
$gender = isset($_POST['gender']) ? mysqli_real_escape_string($conn, trim($_POST['gender'])) : '';

if (!$full_name || !$email || !isset($_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

$sql = "SELECT * FROM users WHERE email='$email'";
$result = mysqli_query($conn, $sql);
if (!$result) {
    echo json_encode(["success" => false, "message" => "Something went wrong! " . mysqli_error($conn)]);
    exit();
}

$row_count = mysqli_num_rows($result);
if ($row_count != 0) {
    echo json_encode(["success" => false, "message" => "This email id is already registered with us!"]);
    exit();
}

$sql = "INSERT INTO users (email, password, full_name, phone, gender, college_name) VALUES ('$email', '$password', '$full_name', '$phone', '$gender', '$college_name')";
$result = mysqli_query($conn, $sql);
if (!$result) {
    echo json_encode(["success" => false, "message" => "Something went wrong! " . mysqli_error($conn)]);
    exit();
}

echo json_encode(["success" => true, "message" => "Your account has been created successfully!"]);
mysqli_close($conn);
