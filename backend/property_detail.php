<?php
session_start();
require "includes/database_connect.php";

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;
$property_id = isset($_GET["property_id"]) ? intval($_GET["property_id"]) : 1;
if ($property_id <= 0) $property_id = 1;

$all_fallback_properties = [
    1 => [
        "property_id" => 1,
        "property_name" => "Navkar Paying Guest",
        "city_name" => "Mumbai",
        "address" => "44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058",
        "description" => "Furnished room with attached washroom, daily housekeeping, 3-course homestyle meals, and 24/7 security near Juhu beach and metro station.",
        "gender" => "male",
        "rent" => 9500,
        "rating_clean" => 4.2,
        "rating_food" => 3.8,
        "rating_safety" => 4.5
    ],
    2 => [
        "property_id" => 2,
        "property_name" => "Ganpati Paying Guest",
        "city_name" => "Mumbai",
        "address" => "Police Station, 115, Sher-e-Punjab Colony, Andheri East, Mumbai 400093",
        "description" => "Spacious co-living PG with dedicated study desks, high-speed WiFi, gym access, and nutritious breakfast & dinner provided daily.",
        "gender" => "female",
        "rent" => 8500,
        "rating_clean" => 4.5,
        "rating_food" => 4.0,
        "rating_safety" => 4.8
    ],
    3 => [
        "property_id" => 3,
        "property_name" => "PG for Girls Shree Radhe",
        "city_name" => "Delhi",
        "address" => "Plot no. 258/D4, Laxman Vihar, Phase 2, Delhi 110001",
        "description" => "Safe, well-maintained girls PG with biometric entrance, air-conditioned rooms, full power backup, and hygienic home-cooked meals.",
        "gender" => "female",
        "rent" => 11000,
        "rating_clean" => 4.7,
        "rating_food" => 4.3,
        "rating_safety" => 4.9
    ],
    4 => [
        "property_id" => 4,
        "property_name" => "Saxena Paying Guest",
        "city_name" => "Delhi",
        "address" => "H.No. 122, Block B, Hauz Khas, New Delhi 110016",
        "description" => "Premium student PG within walking distance of metro and markets. Includes high-speed internet, laundry, and round-the-clock water supply.",
        "gender" => "male",
        "rent" => 12500,
        "rating_clean" => 4.0,
        "rating_food" => 3.9,
        "rating_safety" => 4.2
    ],
    5 => [
        "property_id" => 5,
        "property_name" => "Youth Living Paying Guest",
        "city_name" => "Bengaluru",
        "address" => "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
        "description" => "Modern unisex co-living hub located in prime Indiranagar with high-speed internet, gaming zone, cafe lounge, and housekeeping.",
        "gender" => "unisex",
        "rent" => 14000,
        "rating_clean" => 4.6,
        "rating_food" => 4.4,
        "rating_safety" => 4.6
    ],
    6 => [
        "property_id" => 6,
        "property_name" => "CyberCity Luxury PG",
        "city_name" => "Hyderabad",
        "address" => "Hitec City Main Road, Madhapur, Hyderabad 500081",
        "description" => "Executive PG accommodation for working professionals and students near tech parks. Equipped with AC, TV, WiFi, and meal plan.",
        "gender" => "unisex",
        "rent" => 10500,
        "rating_clean" => 4.3,
        "rating_food" => 4.1,
        "rating_safety" => 4.5
    ],
    7 => [
        "property_id" => 7,
        "property_name" => "Gachibowli Heights PG",
        "city_name" => "Hyderabad",
        "address" => "Plot 45, Telecom Nagar, Gachibowli, Hyderabad 500032",
        "description" => "Modern student accommodation with high-speed internet, food facility, and 24/7 security.",
        "gender" => "male",
        "rent" => 9000,
        "rating_clean" => 4.4,
        "rating_food" => 4.0,
        "rating_safety" => 4.6
    ]
];

$default_amenities = [
    ["name" => "Wifi", "type" => "Building", "icon" => "wifi"],
    ["name" => "Power Backup", "type" => "Building", "icon" => "powerbackup"],
    ["name" => "Fire Extinguisher", "type" => "Building", "icon" => "fireext"],
    ["name" => "CCTV", "type" => "Building", "icon" => "cctv"],
    ["name" => "TV", "type" => "Common Area", "icon" => "tv"],
    ["name" => "Water Purifier", "type" => "Common Area", "icon" => "rowater"],
    ["name" => "Dining", "type" => "Common Area", "icon" => "dining"],
    ["name" => "Washing Machine", "type" => "Common Area", "icon" => "washingmachine"],
    ["name" => "Bed with Mattress", "type" => "Bedroom", "icon" => "bed"],
    ["name" => "Air Conditioner", "type" => "Bedroom", "icon" => "ac"],
    ["name" => "Geyser", "type" => "Washroom", "icon" => "geyser"]
];

$default_testimonials = [
    ["user_name" => "Ashutosh Gowariker", "content" => "You just have to arrive at the place, it's as simple as that. You don't have to worry about anything here!"],
    ["user_name" => "Karan Johar", "content" => "Clean rooms, courteous staff and delicious food. Feels right at home."]
];

$property = isset($all_fallback_properties[$property_id]) ? $all_fallback_properties[$property_id] : $all_fallback_properties[1];
$testimonials = $default_testimonials;
$amenities = $default_amenities;
$interested_users = [];
$interested_users_count = 5;

if ($conn) {
    $sql_1 = "SELECT *, p.id AS property_id, p.name AS property_name, c.name AS city_name 
                FROM properties p
                INNER JOIN cities c ON p.city_id = c.id 
                WHERE p.id = $property_id";
    $result_1 = mysqli_query($conn, $sql_1);
    if ($result_1 && ($db_prop = mysqli_fetch_assoc($result_1))) {
        $property = $db_prop;
        
        $sql_2 = "SELECT * FROM testimonials WHERE property_id = $property_id";
        $result_2 = mysqli_query($conn, $sql_2);
        if ($result_2 && ($db_test = mysqli_fetch_all($result_2, MYSQLI_ASSOC))) {
            if (!empty($db_test)) $testimonials = $db_test;
        }

        $sql_3 = "SELECT a.* 
                    FROM amenities a
                    INNER JOIN properties_amenities pa ON a.id = pa.amenity_id
                    WHERE pa.property_id = $property_id";
        $result_3 = mysqli_query($conn, $sql_3);
        if ($result_3 && ($db_am = mysqli_fetch_all($result_3, MYSQLI_ASSOC))) {
            if (!empty($db_am)) $amenities = $db_am;
        }

        $sql_4 = "SELECT * FROM interested_users_properties WHERE property_id = $property_id";
        $result_4 = mysqli_query($conn, $sql_4);
        if ($result_4) {
            $interested_users = mysqli_fetch_all($result_4, MYSQLI_ASSOC);
            $interested_users_count = mysqli_num_rows($result_4);
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($property['property_name']); ?> | PG Life</title>

    <?php
    include "includes/head_links.php";
    ?>
    <link href="css/property_detail.css" rel="stylesheet" />
</head>

<body>
    <?php
    include "includes/header.php";
    ?>

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb py-2">
            <li class="breadcrumb-item">
                <a href="index.php">Home</a>
            </li>
            <li class="breadcrumb-item">
                <a href="property_list.php?city=<?= urlencode($property['city_name']); ?>"><?= htmlspecialchars($property['city_name']); ?></a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                <?= htmlspecialchars($property['property_name']); ?>
            </li>
        </ol>
    </nav>

    <div id="property-images" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <?php
            $property_images = glob("img/properties/" . $property['property_id'] . "/*");
            if (empty($property_images)) {
                $property_images = ["img/properties/1/1d4f0757fdb86d5f.jpg", "img/properties/1/46ebbb537aa9fb0a.jpg"];
            }
            foreach ($property_images as $index => $property_image) {
            ?>
                <li data-target="#property-images" data-slide-to="<?= $index ?>" class="<?= $index == 0 ? "active" : ""; ?>"></li>
            <?php
            }
            ?>
        </ol>
        <div class="carousel-inner">
            <?php
            foreach ($property_images as $index => $property_image) {
            ?>
                <div class="carousel-item <?= $index == 0 ? "active" : ""; ?>">
                    <img class="d-block w-100" src="<?= htmlspecialchars($property_image) ?>" alt="slide">
                </div>
            <?php
            }
            ?>
        </div>
        <a class="carousel-control-prev" href="#property-images" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#property-images" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>

    <div class="property-summary page-container">
        <div class="row no-gutters justify-content-between">
            <?php
            $total_rating = ($property['rating_clean'] + $property['rating_food'] + $property['rating_safety']) / 3;
            $total_rating = round($total_rating, 1);
            ?>
            <div class="star-container" title="<?= $total_rating ?>">
                <?php
                $rating = $total_rating;
                for ($i = 0; $i < 5; $i++) {
                    if ($rating >= $i + 0.8) {
                ?>
                        <i class="fas fa-star"></i>
                    <?php
                    } elseif ($rating >= $i + 0.3) {
                    ?>
                        <i class="fas fa-star-half-alt"></i>
                    <?php
                    } else {
                    ?>
                        <i class="far fa-star"></i>
                <?php
                    }
                }
                ?>
            </div>
            <div class="interested-container">
                <?php
                $is_interested = false;
                foreach ($interested_users as $interested_user) {
                    if ($interested_user['user_id'] == $user_id) {
                        $is_interested = true;
                    }
                }

                if ($is_interested) {
                ?>
                    <i class="is-interested-image fas fa-heart"></i>
                <?php
                } else {
                ?>
                    <i class="is-interested-image far fa-heart"></i>
                <?php
                }
                ?>
                <div class="interested-text">
                    <span class="interested-user-count"><?= $interested_users_count ?></span> interested
                </div>
            </div>
        </div>
        <div class="detail-container">
            <div class="property-name"><?= htmlspecialchars($property['property_name']) ?></div>
            <div class="property-address"><?= htmlspecialchars($property['address']) ?></div>
            <div class="property-gender">
                <?php
                if ($property['gender'] == "male") {
                ?>
                    <img src="img/male.png">
                <?php
                } elseif ($property['gender'] == "female") {
                ?>
                    <img src="img/female.png">
                <?php
                } else {
                ?>
                    <img src="img/unisex.png">
                <?php
                }
                ?>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="rent-container col-6">
                <div class="rent">₹ <?= number_format($property['rent']) ?>/-</div>
                <div class="rent-unit">per month</div>
            </div>
            <div class="button-container col-6">
                <a href="#" class="btn btn-primary" onclick="alert('Booking request received! Our team will contact you shortly.'); return false;">Book Now</a>
            </div>
        </div>
    </div>

    <div class="property-amenities">
        <div class="page-container">
            <h1>Amenities</h1>
            <div class="row justify-content-between">
                <div class="col-md-auto">
                    <h5>Building</h5>
                    <?php
                    foreach ($amenities as $amenity) {
                        if ($amenity['type'] == "Building") {
                    ?>
                            <div class="amenity-container">
                                <img src="img/amenities/<?= htmlspecialchars($amenity['icon']) ?>.svg">
                                <span><?= htmlspecialchars($amenity['name']) ?></span>
                            </div>
                    <?php
                        }
                    }
                    ?>
                </div>

                <div class="col-md-auto">
                    <h5>Common Area</h5>
                    <?php
                    foreach ($amenities as $amenity) {
                        if ($amenity['type'] == "Common Area") {
                    ?>
                            <div class="amenity-container">
                                <img src="img/amenities/<?= htmlspecialchars($amenity['icon']) ?>.svg">
                                <span><?= htmlspecialchars($amenity['name']) ?></span>
                            </div>
                    <?php
                        }
                    }
                    ?>
                </div>

                <div class="col-md-auto">
                    <h5>Bedroom</h5>
                    <?php
                    foreach ($amenities as $amenity) {
                        if ($amenity['type'] == "Bedroom") {
                    ?>
                            <div class="amenity-container">
                                <img src="img/amenities/<?= htmlspecialchars($amenity['icon']) ?>.svg">
                                <span><?= htmlspecialchars($amenity['name']) ?></span>
                            </div>
                    <?php
                        }
                    }
                    ?>
                </div>

                <div class="col-md-auto">
                    <h5>Washroom</h5>
                    <?php
                    foreach ($amenities as $amenity) {
                        if ($amenity['type'] == "Washroom") {
                    ?>
                            <div class="amenity-container">
                                <img src="img/amenities/<?= htmlspecialchars($amenity['icon']) ?>.svg">
                                <span><?= htmlspecialchars($amenity['name']) ?></span>
                            </div>
                    <?php
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <div class="property-about page-container">
        <h1>About the Property</h1>
        <p><?= htmlspecialchars($property['description']) ?></p>
    </div>

    <div class="property-rating">
        <div class="page-container">
            <h1>Property Rating</h1>
            <div class="row align-items-center justify-content-between">
                <div class="col-md-6">
                    <div class="rating-criteria row">
                        <div class="col-6">
                            <i class="rating-criteria-icon fas fa-broom"></i>
                            <span class="rating-criteria-text">Cleanliness</span>
                        </div>
                        <div class="rating-criteria-star-container col-6" title="<?= $property['rating_clean'] ?>">
                            <?php
                            $rating = $property['rating_clean'];
                            for ($i = 0; $i < 5; $i++) {
                                if ($rating >= $i + 0.8) {
                            ?>
                                    <i class="fas fa-star"></i>
                                <?php
                                } elseif ($rating >= $i + 0.3) {
                                ?>
                                    <i class="fas fa-star-half-alt"></i>
                                <?php
                                } else {
                                ?>
                                    <i class="far fa-star"></i>
                            <?php
                                }
                            }
                            ?>
                        </div>
                    </div>

                    <div class="rating-criteria row">
                        <div class="col-6">
                            <i class="rating-criteria-icon fas fa-utensils"></i>
                            <span class="rating-criteria-text">Food Quality</span>
                        </div>
                        <div class="rating-criteria-star-container col-6" title="<?= $property['rating_food'] ?>">
                            <?php
                            $rating = $property['rating_food'];
                            for ($i = 0; $i < 5; $i++) {
                                if ($rating >= $i + 0.8) {
                            ?>
                                    <i class="fas fa-star"></i>
                                <?php
                                } elseif ($rating >= $i + 0.3) {
                                ?>
                                    <i class="fas fa-star-half-alt"></i>
                                <?php
                                } else {
                                ?>
                                    <i class="far fa-star"></i>
                            <?php
                                }
                            }
                            ?>
                        </div>
                    </div>

                    <div class="rating-criteria row">
                        <div class="col-6">
                            <i class="rating-criteria-icon fa fa-lock"></i>
                            <span class="rating-criteria-text">Safety</span>
                        </div>
                        <div class="rating-criteria-star-container col-6" title="<?= $property['rating_safety'] ?>">
                            <?php
                            $rating = $property['rating_safety'];
                            for ($i = 0; $i < 5; $i++) {
                                if ($rating >= $i + 0.8) {
                            ?>
                                    <i class="fas fa-star"></i>
                                <?php
                                } elseif ($rating >= $i + 0.3) {
                                ?>
                                    <i class="fas fa-star-half-alt"></i>
                                <?php
                                } else {
                                ?>
                                    <i class="far fa-star"></i>
                            <?php
                                }
                            }
                            ?>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="rating-circle">
                        <?php
                        $total_rating = ($property['rating_clean'] + $property['rating_food'] + $property['rating_safety']) / 3;
                        $total_rating = round($total_rating, 1);
                        ?>
                        <div class="total-rating"><?= $total_rating ?></div>
                        <div class="rating-circle-star-container">
                            <?php
                            $rating = $total_rating;
                            for ($i = 0; $i < 5; $i++) {
                                if ($rating >= $i + 0.8) {
                            ?>
                                    <i class="fas fa-star"></i>
                                <?php
                                } elseif ($rating >= $i + 0.3) {
                                ?>
                                    <i class="fas fa-star-half-alt"></i>
                                <?php
                                } else {
                                ?>
                                    <i class="far fa-star"></i>
                            <?php
                                }
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="property-testimonials page-container">
        <h1>What people say</h1>
        <?php
        foreach ($testimonials as $testimonial) {
        ?>
            <div class="testimonial-block">
                <div class="testimonial-image-container">
                    <img class="testimonial-img" src="img/man.png">
                </div>
                <div class="testimonial-text">
                    <i class="fa fa-quote-left" aria-hidden="true"></i>
                    <p><?= htmlspecialchars($testimonial['content']) ?></p>
                </div>
                <div class="testimonial-name">- <?= htmlspecialchars($testimonial['user_name']) ?></div>
            </div>
        <?php
        }
        ?>
    </div>

    <?php
    include "includes/signup_modal.php";
    include "includes/login_modal.php";
    include "includes/footer.php";
    ?>

    <script type="text/javascript" src="js/property_detail.js"></script>
</body>

</html>
