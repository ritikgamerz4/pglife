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

$full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? sha1(trim($_POST['password'])) : '';
$college_name = isset($_POST['college_name']) ? trim($_POST['college_name']) : '';
$gender = isset($_POST['gender']) ? trim($_POST['gender']) : 'male';

if (!$full_name || !$email || empty($_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

if ($conn) {
    $email_safe = mysqli_real_escape_string($conn, $email);
    $sql = "SELECT * FROM users WHERE email='$email_safe'";
    $result = mysqli_query($conn, $sql);
    if ($result && mysqli_num_rows($result) != 0) {
        echo json_encode(["success" => false, "message" => "This email id is already registered with us!"]);
        mysqli_close($conn);
        exit();
    }

    $name_safe = mysqli_real_escape_string($conn, $full_name);
    $phone_safe = mysqli_real_escape_string($conn, $phone);
    $college_safe = mysqli_real_escape_string($conn, $college_name);
    $gender_safe = mysqli_real_escape_string($conn, $gender);

    $sql = "INSERT INTO users (email, password, full_name, phone, gender, college_name) VALUES ('$email_safe', '$password', '$name_safe', '$phone_safe', '$gender_safe', '$college_safe')";
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        echo json_encode(["success" => false, "message" => "Failed to create user in database: " . mysqli_error($conn)]);
        mysqli_close($conn);
        exit();
    }
    mysqli_close($conn);
}

echo json_encode([
    "success" => true,
    "message" => "Your account has been created successfully! You can now log in."
]);
