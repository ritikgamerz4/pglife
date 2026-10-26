<?php
// CORS Headers to allow requests from Vercel frontend
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests immediately
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure session is started if not already
if (session_status() === PHP_SESSION_NONE) {
    // Configure session cookie for cross-origin if HTTPS
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_samesite', 'None');
        ini_set('session.cookie_secure', '1');
    }
    session_start();
}

// Database Credentials from Environment Variables (compatible with Render, Aiven, Clever Cloud, Railway)
$db_host = getenv('DB_HOST') ?: (getenv('MYSQLHOST') ?: '127.0.0.1');
$db_user = getenv('DB_USER') ?: (getenv('MYSQLUSER') ?: 'root');
$db_pass = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : (getenv('MYSQLPASSWORD') !== false ? getenv('MYSQLPASSWORD') : '');
$db_name = getenv('DB_NAME') ?: (getenv('MYSQLDATABASE') ?: 'pglife');
$db_port = getenv('DB_PORT') ? intval(getenv('DB_PORT')) : (getenv('MYSQLPORT') ? intval(getenv('MYSQLPORT')) : 3306);

// Support DATABASE_URL if provided (e.g., mysql://user:password@host:port/dbname)
$database_url = getenv('DATABASE_URL');
if ($database_url) {
    $parsed_url = parse_url($database_url);
    if (!empty($parsed_url['host'])) {
        $db_host = $parsed_url['host'];
        $db_user = isset($parsed_url['user']) ? $parsed_url['user'] : $db_user;
        $db_pass = isset($parsed_url['pass']) ? $parsed_url['pass'] : $db_pass;
        $db_name = isset($parsed_url['path']) ? ltrim($parsed_url['path'], '/') : $db_name;
        $db_port = isset($parsed_url['port']) ? intval($parsed_url['port']) : 3306;
    }
}

$conn = @mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);

if (!$conn) {
    // Return friendly error response
    if (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "Database connection failed. Please check your DB credentials in environment variables."
        ]);
        exit();
    } else {
        die("Database connection failed: " . mysqli_connect_error());
    }
}
?>
