<?php
session_start();
require "includes/database_connect.php";

if (!isset($_SESSION["user_id"])) {
    header("location: index.php");
    die();
}
$user_id = $_SESSION['user_id'];

$user = [
    "id" => $user_id,
    "full_name" => isset($_SESSION['full_name']) ? $_SESSION['full_name'] : "Test User",
    "email" => isset($_SESSION['email']) ? $_SESSION['email'] : "test@pglife.com",
    "phone" => "9876543210",
    "college_name" => "IIT Delhi"
];

$interested_properties = [
    [
        "id" => 1,
        "name" => "Navkar Paying Guest",
        "address" => "44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058",
        "gender" => "male",
        "rent" => 9500,
        "rating_clean" => 4.2,
        "rating_food" => 3.8,
        "rating_safety" => 4.5
    ],
    [
        "id" => 6,
        "name" => "CyberCity Luxury PG",
        "address" => "Hitec City Main Road, Madhapur, Hyderabad 500081",
        "gender" => "unisex",
        "rent" => 10500,
        "rating_clean" => 4.3,
        "rating_food" => 4.1,
        "rating_safety" => 4.5
    ]
];

if ($conn) {
    $sql_1 = "SELECT * FROM users WHERE id = $user_id";
    $result_1 = mysqli_query($conn, $sql_1);
    if ($result_1 && ($db_user = mysqli_fetch_assoc($result_1))) {
        $user = $db_user;
    }

    $sql_2 = "SELECT * 
                FROM interested_users_properties iup
                INNER JOIN properties p ON iup.property_id = p.id
                WHERE iup.user_id = $user_id";
    $result_2 = mysqli_query($conn, $sql_2);
    if ($result_2 && ($db_interested = mysqli_fetch_all($result_2, MYSQLI_ASSOC))) {
        $interested_properties = $db_interested;
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard | PG Life</title>

    <?php
    include "includes/head_links.php";
    ?>
    <link href="css/dashboard.css" rel="stylesheet" />
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
            <li class="breadcrumb-item active" aria-current="page">
                Dashboard
            </li>
        </ol>
    </nav>

    <div class="my-profile page-container">
        <h1>My Profile</h1>
        <div class="row">
            <div class="col-md-3 profile-img-container">
                <i class="fas fa-user profile-img"></i>
            </div>
            <div class="col-md-9">
                <div class="row no-gutters justify-content-between align-items-end">
                    <div class="profile">
                        <div class="name"><?= htmlspecialchars($user['full_name']) ?></div>
                        <div class="email"><?= htmlspecialchars($user['email']) ?></div>
                        <div class="phone"><?= htmlspecialchars($user['phone']) ?></div>
                        <div class="college"><?= htmlspecialchars($user['college_name']) ?></div>
                    </div>
                    <div class="edit">
                        <div class="edit-profile" onclick="alert('Profile is synced with your account.')">Edit Profile</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
    if (count($interested_properties) > 0) {
    ?>
        <div class="my-interested-properties">
            <div class="page-container">
                <h1>My Interested Properties</h1>

                <?php
                foreach ($interested_properties as $property) {
                    $property_images = glob("img/properties/" . $property['id'] . "/*");
                    if (empty($property_images)) {
                        $property_images = ["img/properties/1/1d4f0757fdb86d5f.jpg"];
                    }
                ?>
                    <div class="property-card property-id-<?= $property['id'] ?> row">
                        <div class="image-container col-md-4">
                            <img src="<?= htmlspecialchars($property_images[0]) ?>" />
                        </div>
                        <div class="content-container col-md-8">
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
                                    <i class="is-interested-image fas fa-heart" property_id="<?= $property['id'] ?>"></i>
                                </div>
                            </div>
                            <div class="detail-container">
                                <div class="property-name"><?= htmlspecialchars($property['name']) ?></div>
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
                                    <a href="property_detail.php?property_id=<?= $property['id'] ?>" class="btn btn-primary">View</a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php
                }
                ?>
            </div>
        </div>
    <?php
    }
    ?>

    <?php
    include "includes/footer.php";
    ?>

    <script type="text/javascript" src="js/dashboard.js"></script>
</body>

</html>
