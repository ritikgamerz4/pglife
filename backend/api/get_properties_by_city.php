<?php
require("../includes/database_connect.php");

header('Content-Type: application/json');

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;
$city_name = isset($_GET["city"]) ? mysqli_real_escape_string($conn, trim($_GET["city"])) : '';

if (empty($city_name)) {
    echo json_encode([]);
    exit();
}

$sql_1 = "SELECT * FROM cities WHERE LOWER(name) = LOWER('$city_name')";
$result_1 = mysqli_query($conn, $sql_1);
if (!$result_1) {
    http_response_code(500);
    echo json_encode(["error" => "Database query failed: " . mysqli_error($conn)]);
    exit();
}

$city = mysqli_fetch_assoc($result_1);
if (!$city) {
    echo json_encode([]);
    exit();
}
$city_id = $city['id'];

$sql_2 = "SELECT * FROM properties WHERE city_id = $city_id";
$result_2 = mysqli_query($conn, $sql_2);
if (!$result_2) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch properties"]);
    exit();
}
$properties = mysqli_fetch_all($result_2, MYSQLI_ASSOC);

$sql_3 = "SELECT * 
          FROM interested_users_properties iup
          INNER JOIN properties p ON iup.property_id = p.id
          WHERE p.city_id = $city_id";
$result_3 = mysqli_query($conn, $sql_3);
$interested_users_properties = $result_3 ? mysqli_fetch_all($result_3, MYSQLI_ASSOC) : [];

$new_properties = array();
foreach ($properties as $property) {
    $img_dir = __DIR__ . "/../img/properties/" . $property['id'];
    $property_images = glob($img_dir . "/*");
    
    if (!empty($property_images) && file_exists($property_images[0])) {
        $property_image = "img/properties/" . $property['id'] . "/" . basename($property_images[0]);
    } else {
        $property_image = "img/properties/1/1d4f0757fdb86d5f.jpg";
    }

    $interested_users_count = 0;
    $is_interested = false;
    foreach ($interested_users_properties as $interested_user_property) {
        if ($interested_user_property['property_id'] == $property['id']) {
            $interested_users_count++;

            if ($interested_user_property['user_id'] == $user_id) {
                $is_interested = true;
            }
        }
    }
    $property['interested_users_count'] = $interested_users_count;
    $property['is_interested'] = $is_interested;
    $property['image'] = $property_image;
    $new_properties[] = $property;
}

echo json_encode($new_properties);
mysqli_close($conn);
