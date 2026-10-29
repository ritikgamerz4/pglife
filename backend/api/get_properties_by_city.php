<?php
require("../includes/database_connect.php");

header('Content-Type: application/json');

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;
$city_name = isset($_GET["city"]) ? trim($_GET["city"]) : 'Mumbai';
if (empty($city_name)) {
    $city_name = 'Mumbai';
}

$fallback_properties = [
    'hyderabad' => [
        [
            "id" => 6,
            "city_id" => 4,
            "name" => "CyberCity Luxury PG",
            "address" => "Hitec City Main Road, Madhapur, Hyderabad 500081",
            "description" => "Executive PG accommodation for working professionals and students near tech parks. Equipped with AC, TV, WiFi, and meal plan.",
            "gender" => "unisex",
            "rent" => 10500,
            "rating_clean" => 4.3,
            "rating_food" => 4.1,
            "rating_safety" => 4.5,
            "image" => "img/properties/1/1d4f0757fdb86d5f.jpg",
            "interested_users_count" => 4,
            "is_interested" => false
        ],
        [
            "id" => 7,
            "city_id" => 4,
            "name" => "Gachibowli Heights PG",
            "address" => "Plot 45, Telecom Nagar, Gachibowli, Hyderabad 500032",
            "description" => "Modern student accommodation with high-speed internet, food facility, gym, and 24/7 security.",
            "gender" => "male",
            "rent" => 9000,
            "rating_clean" => 4.4,
            "rating_food" => 4.0,
            "rating_safety" => 4.6,
            "image" => "img/properties/2/1dcfc57947b5c712.jpg",
            "interested_users_count" => 3,
            "is_interested" => false
        ]
    ],
    'delhi' => [
        [
            "id" => 3,
            "city_id" => 1,
            "name" => "PG for Girls Shree Radhe",
            "address" => "Plot no. 258/D4, Laxman Vihar, Phase 2, Delhi 110001",
            "description" => "Safe, well-maintained girls PG with biometric entrance, air-conditioned rooms, full power backup, and hygienic home-cooked meals.",
            "gender" => "female",
            "rent" => 11000,
            "rating_clean" => 4.7,
            "rating_food" => 4.3,
            "rating_safety" => 4.9,
            "image" => "img/properties/1/eace7b9114fd6046.jpg",
            "interested_users_count" => 6,
            "is_interested" => false
        ],
        [
            "id" => 4,
            "city_id" => 1,
            "name" => "Saxena Paying Guest",
            "address" => "H.No. 122, Block B, Hauz Khas, New Delhi 110016",
            "description" => "Premium student PG within walking distance of metro and markets. Includes high-speed internet, laundry, and round-the-clock water supply.",
            "gender" => "male",
            "rent" => 12500,
            "rating_clean" => 4.0,
            "rating_food" => 3.9,
            "rating_safety" => 4.2,
            "image" => "img/properties/1/46ebbb537aa9fb0a.jpg",
            "interested_users_count" => 2,
            "is_interested" => false
        ]
    ],
    'mumbai' => [
        [
            "id" => 1,
            "city_id" => 2,
            "name" => "Navkar Paying Guest",
            "address" => "44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058",
            "description" => "Furnished room with attached washroom, daily housekeeping, 3-course homestyle meals, and 24/7 security near Juhu beach and metro station.",
            "gender" => "male",
            "rent" => 9500,
            "rating_clean" => 4.2,
            "rating_food" => 3.8,
            "rating_safety" => 4.5,
            "image" => "img/properties/1/1d4f0757fdb86d5f.jpg",
            "interested_users_count" => 5,
            "is_interested" => false
        ],
        [
            "id" => 2,
            "city_id" => 2,
            "name" => "Ganpati Paying Guest",
            "address" => "Police Station, 115, Sher-e-Punjab Colony, Andheri East, Mumbai 400093",
            "description" => "Spacious co-living PG with dedicated study desks, high-speed WiFi, gym access, and nutritious breakfast & dinner provided daily.",
            "gender" => "female",
            "rent" => 8500,
            "rating_clean" => 4.5,
            "rating_food" => 4.0,
            "rating_safety" => 4.8,
            "image" => "img/properties/2/1dcfc57947b5c712.jpg",
            "interested_users_count" => 4,
            "is_interested" => false
        ]
    ],
    'bengaluru' => [
        [
            "id" => 5,
            "city_id" => 3,
            "name" => "Youth Living Paying Guest",
            "address" => "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
            "description" => "Modern unisex co-living hub located in prime Indiranagar with high-speed internet, gaming zone, cafe lounge, and housekeeping.",
            "gender" => "unisex",
            "rent" => 14000,
            "rating_clean" => 4.6,
            "rating_food" => 4.4,
            "rating_safety" => 4.6,
            "image" => "img/properties/1/46ebbb537aa9fb0a.jpg",
            "interested_users_count" => 7,
            "is_interested" => false
        ]
    ]
];

$city_key = strtolower($city_name);
$properties_result = isset($fallback_properties[$city_key]) ? $fallback_properties[$city_key] : [];

// If DB connection is alive, try querying database
if ($conn) {
    $city_name_safe = mysqli_real_escape_string($conn, $city_name);
    $sql_1 = "SELECT * FROM cities WHERE LOWER(name) = LOWER('$city_name_safe')";
    $result_1 = mysqli_query($conn, $sql_1);
    if ($result_1 && ($city = mysqli_fetch_assoc($result_1))) {
        $city_id = $city['id'];
        $sql_2 = "SELECT * FROM properties WHERE city_id = $city_id";
        $result_2 = mysqli_query($conn, $sql_2);
        if ($result_2) {
            $db_props = mysqli_fetch_all($result_2, MYSQLI_ASSOC);
            if (!empty($db_props)) {
                $sql_3 = "SELECT * FROM interested_users_properties iup INNER JOIN properties p ON iup.property_id = p.id WHERE p.city_id = $city_id";
                $result_3 = mysqli_query($conn, $sql_3);
                $interested_users_properties = $result_3 ? mysqli_fetch_all($result_3, MYSQLI_ASSOC) : [];

                $new_properties = array();
                foreach ($db_props as $property) {
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
                $properties_result = $new_properties;
            }
        }
    }
}

echo json_encode($properties_result);
if ($conn) {
    mysqli_close($conn);
}
