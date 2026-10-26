-- ========================================================
-- PG Life Database Schema and Seed Data
-- ========================================================

CREATE DATABASE IF NOT EXISTS `pglife` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pglife`;

-- --------------------------------------------------------
-- Table structure for table `cities`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `interested_users_properties`;
DROP TABLE IF EXISTS `properties_amenities`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `properties`;
DROP TABLE IF EXISTS `amenities`;
DROP TABLE IF EXISTS `cities`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `cities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `cities` (`id`, `name`) VALUES
(1, 'Delhi'),
(2, 'Mumbai'),
(3, 'Bengaluru'),
(4, 'Hyderabad');

-- --------------------------------------------------------
-- Table structure for table `amenities`
-- --------------------------------------------------------
CREATE TABLE `amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `amenities` (`id`, `name`, `type`, `icon`) VALUES
(1, 'Wifi', 'Building', 'wifi'),
(2, 'Power Backup', 'Building', 'powerbackup'),
(3, 'Fire Extinguisher', 'Building', 'fireext'),
(4, 'CCTV', 'Building', 'cctv'),
(5, 'Parking', 'Building', 'parking'),
(6, 'Lift', 'Building', 'lift'),
(7, 'TV', 'Common Area', 'tv'),
(8, 'Water Purifier', 'Common Area', 'rowater'),
(9, 'Dining', 'Common Area', 'dining'),
(10, 'Washing Machine', 'Common Area', 'washingmachine'),
(11, 'Bed with Mattress', 'Bedroom', 'bed'),
(12, 'Air Conditioner', 'Bedroom', 'ac'),
(13, 'Geyser', 'Washroom', 'geyser');

-- --------------------------------------------------------
-- Table structure for table `properties`
-- --------------------------------------------------------
CREATE TABLE `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `city_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `gender` ENUM('male', 'female', 'unisex') NOT NULL,
  `rent` INT NOT NULL,
  `rating_clean` FLOAT NOT NULL,
  `rating_food` FLOAT NOT NULL,
  `rating_safety` FLOAT NOT NULL,
  FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `properties` (`id`, `city_id`, `name`, `address`, `description`, `gender`, `rent`, `rating_clean`, `rating_food`, `rating_safety`) VALUES
(1, 2, 'Navkar Paying Guest', '44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058', 'Furnished room with attached washroom, daily housekeeping, 3-course homestyle meals, and 24/7 security near Juhu beach and metro station.', 'male', 9500, 4.2, 3.8, 4.5),
(2, 2, 'Ganpati Paying Guest', 'Police Station, 115, Sher-e-Punjab Colony, Andheri East, Mumbai 400093', 'Spacious co-living PG with dedicated study desks, high-speed WiFi, gym access, and nutritious breakfast & dinner provided daily.', 'female', 8500, 4.5, 4.0, 4.8),
(3, 1, 'PG for Girls Shree Radhe', 'Plot no. 258/D4, Laxman Vihar, Phase 2, Delhi 110001', 'Safe, well-maintained girls PG with biometric entrance, air-conditioned rooms, full power backup, and hygienic home-cooked meals.', 'female', 11000, 4.7, 4.3, 4.9),
(4, 1, 'Saxena Paying Guest', 'H.No. 122, Block B, Hauz Khas, New Delhi 110016', 'Premium student PG within walking distance of metro and markets. Includes high-speed internet, laundry, and round-the-clock water supply.', 'male', 12500, 4.0, 3.9, 4.2),
(5, 3, 'Youth Living Paying Guest', '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', 'Modern unisex co-living hub located in prime Indiranagar with high-speed internet, gaming zone, cafe lounge, and housekeeping.', 'unisex', 14000, 4.6, 4.4, 4.6),
(6, 4, 'CyberCity Luxury PG', 'Hitec City Main Road, Madhapur, Hyderabad 500081', 'Executive PG accommodation for working professionals and students near tech parks. Equipped with AC, TV, WiFi, and meal plan.', 'unisex', 10500, 4.3, 4.1, 4.5);

-- --------------------------------------------------------
-- Table structure for table `properties_amenities`
-- --------------------------------------------------------
CREATE TABLE `properties_amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT NOT NULL,
  `amenity_id` INT NOT NULL,
  FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `properties_amenities` (`id`, `property_id`, `amenity_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 4),
(4, 1, 8),
(5, 1, 10),
(6, 1, 11),
(7, 1, 13),
(8, 2, 1),
(9, 2, 3),
(10, 2, 4),
(11, 2, 7),
(12, 2, 8),
(13, 2, 10),
(14, 2, 11),
(15, 2, 12),
(16, 2, 13),
(17, 3, 1),
(18, 3, 2),
(19, 3, 4),
(20, 3, 8),
(21, 3, 11),
(22, 3, 12),
(23, 3, 13),
(24, 4, 1),
(25, 4, 2),
(26, 4, 5),
(27, 4, 8),
(28, 4, 11),
(29, 4, 13),
(30, 5, 1),
(31, 5, 2),
(32, 5, 4),
(33, 5, 6),
(34, 5, 7),
(35, 5, 8),
(36, 5, 10),
(37, 5, 11),
(38, 5, 12),
(39, 5, 13),
(40, 6, 1),
(41, 6, 2),
(42, 6, 4),
(43, 6, 5),
(44, 6, 7),
(45, 6, 8),
(46, 6, 10),
(47, 6, 11),
(48, 6, 12),
(49, 6, 13);

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------
CREATE TABLE `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `testimonials` (`id`, `property_id`, `user_name`, `content`) VALUES
(1, 1, 'Ashutosh Gowariker', 'You just have to arrive at the place, it\'s as simple as that. You don\'t have to worry about anything here!'),
(2, 1, 'Karan Johar', 'Clean rooms, courteous staff and delicious food. Feels right at home.'),
(3, 2, 'Neha Kakkar', 'Loved the stay here! Super safe neighborhood and very convenient for daily commuting.'),
(4, 3, 'Shraddha Kapoor', 'Amazing safety and hygiene protocols. Best PG for female students in Delhi.'),
(5, 4, 'Ranbir Kapoor', 'Great connectivity, clean study rooms, and reliable high-speed internet for college work.'),
(6, 5, 'Rahul Dravid', 'Best co-living space in Indiranagar. Extremely peaceful yet close to all amenities.');

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
-- Default password for test users is: password123 (sha1: 40bd001563085fc35165329ea1ff5c5ecbdbbeef)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `gender` ENUM('male', 'female') NOT NULL,
  `college_name` VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `phone`, `gender`, `college_name`) VALUES
(1, 'test@pglife.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'Test User', '9876543210', 'male', 'IIT Delhi'),
(2, 'ananya@pglife.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'Ananya Sharma', '9812345678', 'female', 'St. Xavier College Mumbai');

-- --------------------------------------------------------
-- Table structure for table `interested_users_properties`
-- --------------------------------------------------------
CREATE TABLE `interested_users_properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `property_id` INT NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `interested_users_properties` (`id`, `user_id`, `property_id`) VALUES
(1, 1, 1),
(2, 1, 4),
(3, 2, 2),
(4, 2, 3);
