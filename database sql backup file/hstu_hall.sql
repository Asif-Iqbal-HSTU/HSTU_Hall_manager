-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: hall_manager_hstu
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-a4f64d71d17bf76d9534c05906a5a9cf','i:1;',1784106141),('laravel-cache-a4f64d71d17bf76d9534c05906a5a9cf:timer','i:1784106141;',1784106141),('laravel-cache-c3175272d5f90cf460e8baa30c4cd2f9','i:1;',1782450385),('laravel-cache-c3175272d5f90cf460e8baa30c4cd2f9:timer','i:1782450385;',1782450385),('laravel-cache-f0a84d7c6ec909404e1d304bdd19b964','i:1;',1784532826),('laravel-cache-f0a84d7c6ec909404e1d304bdd19b964:timer','i:1784532826;',1784532826);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canteen_costings`
--

DROP TABLE IF EXISTS `canteen_costings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canteen_costings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hall_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `breakfast_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `lunch_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dinner_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `canteen_costings_hall_id_date_unique` (`hall_id`,`date`),
  CONSTRAINT `canteen_costings_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canteen_costings`
--

LOCK TABLES `canteen_costings` WRITE;
/*!40000 ALTER TABLE `canteen_costings` DISABLE KEYS */;
/*!40000 ALTER TABLE `canteen_costings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canteen_menus`
--

DROP TABLE IF EXISTS `canteen_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canteen_menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hall_id` bigint unsigned NOT NULL,
  `day_of_week` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `breakfast` text COLLATE utf8mb4_unicode_ci,
  `lunch` text COLLATE utf8mb4_unicode_ci,
  `dinner` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `canteen_menus_hall_id_day_of_week_unique` (`hall_id`,`day_of_week`),
  CONSTRAINT `canteen_menus_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canteen_menus`
--

LOCK TABLES `canteen_menus` WRITE;
/*!40000 ALTER TABLE `canteen_menus` DISABLE KEYS */;
/*!40000 ALTER TABLE `canteen_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district_distances`
--

DROP TABLE IF EXISTS `district_distances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `district_distances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `district_distances_district_unique` (`district`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district_distances`
--

LOCK TABLES `district_distances` WRITE;
/*!40000 ALTER TABLE `district_distances` DISABLE KEYS */;
INSERT INTO `district_distances` VALUES (1,'Dinajpur',5,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(2,'Rangpur',75,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(3,'Gaibandha',110,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(4,'Kurigram',125,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(5,'Lalmonirhat',120,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(6,'Nilphamari',60,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(7,'Panchagarh',115,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(8,'Thakurgaon',80,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(9,'Joypurhat',110,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(10,'Bogura',140,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(11,'Naogaon',150,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(12,'Rajshahi',215,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(13,'Chapainawabganj',250,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(14,'Natore',220,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(15,'Sirajganj',240,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(16,'Pabna',275,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(17,'Mymensingh',310,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(18,'Jamalpur',290,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(19,'Sherpur',320,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(20,'Netrokona',360,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(21,'Dhaka',338,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(22,'Gazipur',320,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(23,'Narayanganj',360,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(24,'Narsingdi',380,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(25,'Tangail',250,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(26,'Manikganj',310,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(27,'Munshiganj',375,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(28,'Faridpur',390,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(29,'Madaripur',430,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(30,'Shariatpur',450,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(31,'Rajbari',360,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(32,'Gopalganj',440,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(33,'Kishoreganj',380,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(34,'Sylhet',510,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(35,'Sunamganj',490,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(36,'Habiganj',450,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(37,'Moulvibazar',495,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(38,'Khulna',450,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(39,'Jashore',390,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(40,'Satkhira',460,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(41,'Bagerhat',480,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(42,'Kushtia',310,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(43,'Jhenaidah',350,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(44,'Chuadanga',330,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(45,'Meherpur',310,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(46,'Magura',360,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(47,'Narail',400,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(48,'Barishal',530,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(49,'Patuakhali',580,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(50,'Bhola',620,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(51,'Pirojpur',540,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(52,'Jhalokathi',545,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(53,'Barguna',600,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(54,'Chattogram',590,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(55,'Cox\'s Bazar',720,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(56,'Feni',520,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(57,'Noakhali',550,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(58,'Lakshmipur',540,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(59,'Chandpur',490,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(60,'Cumilla',470,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(61,'Brahmanbaria',430,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(62,'Rangamati',650,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(63,'Bandarban',680,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(64,'Khagrachhari',620,'2026-06-25 22:18:49','2026-06-25 22:18:49');
/*!40000 ALTER TABLE `district_distances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hall_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_number` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `floors_hall_id_foreign` (`hall_id`),
  CONSTRAINT `floors_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,1,'1 Floor',1,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,1,'2 Floor',2,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(3,1,'3 Floor',3,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(4,2,'1 Floor',1,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(5,2,'2 Floor',2,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(6,2,'3 Floor',3,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(7,3,'1 Floor',1,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(8,3,'2 Floor',2,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(9,3,'3 Floor',3,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(10,4,'1 Floor',1,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(11,4,'2 Floor',2,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(12,4,'3 Floor',3,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(13,5,'1 Floor',1,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(14,5,'2 Floor',2,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(15,5,'3 Floor',3,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(16,6,'1 Floor',1,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(17,6,'2 Floor',2,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(18,6,'3 Floor',3,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(19,7,'1 Floor',1,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(20,7,'2 Floor',2,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(21,7,'3 Floor',3,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(22,8,'1 Floor',1,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(23,8,'2 Floor',2,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(24,8,'3 Floor',3,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(25,9,'1 Floor',1,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(26,9,'2 Floor',2,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(27,9,'3 Floor',3,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(28,1,'6 Floor',6,'2026-07-21 00:32:23','2026-07-21 00:32:23');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `halls`
--

DROP TABLE IF EXISTS `halls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `halls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `application_start` datetime DEFAULT NULL,
  `application_end` datetime DEFAULT NULL,
  `application_message` text COLLATE utf8mb4_unicode_ci,
  `is_application_active` tinyint(1) NOT NULL DEFAULT '0',
  `canteen_default_breakfast_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `canteen_default_lunch_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `canteen_default_dinner_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `halls`
--

LOCK TABLES `halls` WRITE;
/*!40000 ALTER TABLE `halls` DISABLE KEYS */;
INSERT INTO `halls` VALUES (1,'Shaheed Nur Hossain Hall','male','2026-06-25 22:18:49','2026-06-25 23:09:24','2026-06-24 05:05:00','2026-06-30 11:06:00','Applications are now open for seat allocation in Shaheed Nur Hossain Hall. Please submit your application with correct academic and personal details before the deadline.',1,20.00,50.00,40.00),(2,'Shaheed President Ziaur Rahman Hall','male','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(3,'Shaheed Abrar Fahad Hall','male','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(4,'International Hall','male','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(5,'Bijoy 24 Hall','male','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(6,'Begum Rokeya Hall','female','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(7,'Nawab Faizunnesa Hall','female','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(8,'Kobi Sufia Kamal Hall','female','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00),(9,'Khurshid Zahan Haque Hall','female','2026-06-25 22:18:49','2026-06-25 22:18:49',NULL,NULL,NULL,0,0.00,0.00,0.00);
/*!40000 ALTER TABLE `halls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_bookings`
--

DROP TABLE IF EXISTS `meal_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `hall_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `breakfast_units` int NOT NULL DEFAULT '0',
  `lunch_units` int NOT NULL DEFAULT '0',
  `dinner_units` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meal_bookings_user_id_date_unique` (`user_id`,`date`),
  KEY `meal_bookings_hall_id_foreign` (`hall_id`),
  CONSTRAINT `meal_bookings_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meal_bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_bookings`
--

LOCK TABLES `meal_bookings` WRITE;
/*!40000 ALTER TABLE `meal_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_14_170933_add_two_factor_columns_to_users_table',1),(5,'2026_05_03_061436_create_halls_table',1),(6,'2026_05_03_061437_create_floors_table',1),(7,'2026_05_03_061438_a_create_rooms_table',1),(8,'2026_05_03_061438_b_create_seats_table',1),(9,'2026_05_03_061438_c_create_student_profiles_table',1),(10,'2026_05_03_061438_d_create_seat_applications_table',1),(11,'2026_05_03_061439_create_staff_profiles_table',1),(12,'2026_05_03_061439_create_teacher_profiles_table',1),(13,'2026_06_20_051314_add_application_period_columns_to_halls_table',1),(14,'2026_06_23_025740_create_canteen_tables',1),(15,'2026_06_23_033533_create_district_distances_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `floor_id` bigint unsigned NOT NULL,
  `room_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` enum('residential','common_room','office','dining_hall') COLLATE utf8mb4_unicode_ci NOT NULL,
  `square_feet` decimal(8,2) DEFAULT NULL,
  `capacity` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rooms_floor_id_foreign` (`floor_id`),
  CONSTRAINT `rooms_floor_id_foreign` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,'10101','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,1,'10102','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(3,1,'10103','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(4,1,'10104','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(5,1,'10105','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(6,2,'10201','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(7,2,'10202','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(8,2,'10203','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(9,2,'10204','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(10,2,'10205','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(11,3,'10301','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(12,3,'10302','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(13,3,'10303','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(14,3,'10304','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(15,3,'10305','residential',200.00,4,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(16,4,'20101','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(17,4,'20102','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(18,4,'20103','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(19,4,'20104','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(20,4,'20105','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(21,5,'20201','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(22,5,'20202','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(23,5,'20203','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(24,5,'20204','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(25,5,'20205','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(26,6,'20301','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(27,6,'20302','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(28,6,'20303','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(29,6,'20304','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(30,6,'20305','residential',200.00,4,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(31,7,'30101','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(32,7,'30102','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(33,7,'30103','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(34,7,'30104','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(35,7,'30105','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(36,8,'30201','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(37,8,'30202','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(38,8,'30203','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(39,8,'30204','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(40,8,'30205','residential',200.00,4,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(41,9,'30301','residential',200.00,4,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(42,9,'30302','residential',200.00,4,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(43,9,'30303','residential',200.00,4,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(44,9,'30304','residential',200.00,4,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(45,9,'30305','residential',200.00,4,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(46,10,'40101','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(47,10,'40102','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(48,10,'40103','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(49,10,'40104','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(50,10,'40105','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(51,11,'40201','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(52,11,'40202','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(53,11,'40203','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(54,11,'40204','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(55,11,'40205','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(56,12,'40301','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(57,12,'40302','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(58,12,'40303','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(59,12,'40304','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(60,12,'40305','residential',200.00,4,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(61,13,'50101','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(62,13,'50102','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(63,13,'50103','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(64,13,'50104','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(65,13,'50105','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(66,14,'50201','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(67,14,'50202','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(68,14,'50203','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(69,14,'50204','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(70,14,'50205','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(71,15,'50301','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(72,15,'50302','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(73,15,'50303','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(74,15,'50304','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(75,15,'50305','residential',200.00,4,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(76,16,'60101','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(77,16,'60102','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(78,16,'60103','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(79,16,'60104','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(80,16,'60105','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(81,17,'60201','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(82,17,'60202','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(83,17,'60203','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(84,17,'60204','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(85,17,'60205','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(86,18,'60301','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(87,18,'60302','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(88,18,'60303','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(89,18,'60304','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(90,18,'60305','residential',200.00,4,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(91,19,'70101','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(92,19,'70102','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(93,19,'70103','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(94,19,'70104','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(95,19,'70105','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(96,20,'70201','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(97,20,'70202','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(98,20,'70203','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(99,20,'70204','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(100,20,'70205','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(101,21,'70301','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(102,21,'70302','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(103,21,'70303','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(104,21,'70304','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(105,21,'70305','residential',200.00,4,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(106,22,'80101','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(107,22,'80102','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(108,22,'80103','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(109,22,'80104','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(110,22,'80105','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(111,23,'80201','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(112,23,'80202','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(113,23,'80203','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(114,23,'80204','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(115,23,'80205','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(116,24,'80301','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(117,24,'80302','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(118,24,'80303','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(119,24,'80304','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(120,24,'80305','residential',200.00,4,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(121,25,'90101','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(122,25,'90102','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(123,25,'90103','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(124,25,'90104','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(125,25,'90105','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(126,26,'90201','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(127,26,'90202','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(128,26,'90203','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(129,26,'90204','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(130,26,'90205','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(131,27,'90301','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(132,27,'90302','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(133,27,'90303','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(134,27,'90304','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(135,27,'90305','residential',200.00,4,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(136,6,'301','residential',200.00,4,'2026-07-20 23:57:45','2026-07-20 23:57:45'),(137,28,'67','residential',200.00,4,'2026-07-21 00:32:23','2026-07-21 00:32:23'),(138,15,'301','residential',200.00,4,'2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_applications`
--

DROP TABLE IF EXISTS `seat_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `hall_id` bigint unsigned NOT NULL,
  `status` enum('pending','approved','denied') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `cgpa` decimal(3,2) DEFAULT NULL,
  `guardian_income` decimal(10,2) DEFAULT NULL,
  `distance_from_home` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seat_applications_student_id_foreign` (`student_id`),
  KEY `seat_applications_hall_id_foreign` (`hall_id`),
  CONSTRAINT `seat_applications_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seat_applications_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_applications`
--

LOCK TABLES `seat_applications` WRITE;
/*!40000 ALTER TABLE `seat_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `seat_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_id` bigint unsigned NOT NULL,
  `seat_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('available','booked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seats_room_id_foreign` (`room_id`),
  CONSTRAINT `seats_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=544 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'10101-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,1,'10101-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(3,1,'10101-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(4,1,'10101-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(5,2,'10102-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(6,2,'10102-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(7,2,'10102-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(8,2,'10102-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(9,3,'10103-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(10,3,'10103-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(11,3,'10103-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(12,3,'10103-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(13,4,'10104-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(14,4,'10104-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(15,4,'10104-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(16,4,'10104-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(17,5,'10105-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(18,5,'10105-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(19,5,'10105-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(20,5,'10105-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(21,6,'10201-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(22,6,'10201-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(23,6,'10201-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(24,6,'10201-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(25,7,'10202-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(26,7,'10202-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(27,7,'10202-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(28,7,'10202-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(29,8,'10203-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(30,8,'10203-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(31,8,'10203-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(32,8,'10203-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(33,9,'10204-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(34,9,'10204-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(35,9,'10204-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(36,9,'10204-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(37,10,'10205-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(38,10,'10205-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(39,10,'10205-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(40,10,'10205-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(41,11,'10301-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(42,11,'10301-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(43,11,'10301-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(44,11,'10301-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(45,12,'10302-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(46,12,'10302-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(47,12,'10302-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(48,12,'10302-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(49,13,'10303-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(50,13,'10303-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(51,13,'10303-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(52,13,'10303-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(53,14,'10304-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(54,14,'10304-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(55,14,'10304-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(56,14,'10304-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(57,15,'10305-1','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(58,15,'10305-2','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(59,15,'10305-3','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(60,15,'10305-4','available','2026-06-25 22:18:50','2026-06-25 22:18:50'),(61,16,'20101-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(62,16,'20101-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(63,16,'20101-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(64,16,'20101-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(65,17,'20102-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(66,17,'20102-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(67,17,'20102-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(68,17,'20102-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(69,18,'20103-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(70,18,'20103-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(71,18,'20103-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(72,18,'20103-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(73,19,'20104-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(74,19,'20104-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(75,19,'20104-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(76,19,'20104-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(77,20,'20105-1','booked','2026-06-25 22:18:57','2026-06-25 22:28:57'),(78,20,'20105-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(79,20,'20105-3','booked','2026-06-25 22:18:57','2026-06-25 22:59:29'),(80,20,'20105-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(81,21,'20201-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(82,21,'20201-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(83,21,'20201-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(84,21,'20201-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(85,22,'20202-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(86,22,'20202-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(87,22,'20202-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(88,22,'20202-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(89,23,'20203-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(90,23,'20203-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(91,23,'20203-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(92,23,'20203-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(93,24,'20204-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(94,24,'20204-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(95,24,'20204-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(96,24,'20204-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(97,25,'20205-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(98,25,'20205-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(99,25,'20205-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(100,25,'20205-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(101,26,'20301-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(102,26,'20301-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(103,26,'20301-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(104,26,'20301-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(105,27,'20302-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(106,27,'20302-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(107,27,'20302-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(108,27,'20302-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(109,28,'20303-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(110,28,'20303-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(111,28,'20303-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(112,28,'20303-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(113,29,'20304-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(114,29,'20304-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(115,29,'20304-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(116,29,'20304-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(117,30,'20305-1','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(118,30,'20305-2','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(119,30,'20305-3','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(120,30,'20305-4','available','2026-06-25 22:18:57','2026-06-25 22:18:57'),(121,31,'30101-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(122,31,'30101-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(123,31,'30101-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(124,31,'30101-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(125,32,'30102-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(126,32,'30102-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(127,32,'30102-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(128,32,'30102-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(129,33,'30103-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(130,33,'30103-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(131,33,'30103-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(132,33,'30103-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(133,34,'30104-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(134,34,'30104-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(135,34,'30104-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(136,34,'30104-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(137,35,'30105-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(138,35,'30105-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(139,35,'30105-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(140,35,'30105-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(141,36,'30201-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(142,36,'30201-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(143,36,'30201-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(144,36,'30201-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(145,37,'30202-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(146,37,'30202-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(147,37,'30202-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(148,37,'30202-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(149,38,'30203-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(150,38,'30203-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(151,38,'30203-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(152,38,'30203-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(153,39,'30204-1','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(154,39,'30204-2','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(155,39,'30204-3','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(156,39,'30204-4','available','2026-06-25 22:19:03','2026-06-25 22:19:03'),(157,40,'30205-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(158,40,'30205-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(159,40,'30205-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(160,40,'30205-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(161,41,'30301-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(162,41,'30301-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(163,41,'30301-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(164,41,'30301-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(165,42,'30302-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(166,42,'30302-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(167,42,'30302-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(168,42,'30302-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(169,43,'30303-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(170,43,'30303-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(171,43,'30303-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(172,43,'30303-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(173,44,'30304-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(174,44,'30304-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(175,44,'30304-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(176,44,'30304-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(177,45,'30305-1','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(178,45,'30305-2','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(179,45,'30305-3','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(180,45,'30305-4','available','2026-06-25 22:19:04','2026-06-25 22:19:04'),(181,46,'40101-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(182,46,'40101-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(183,46,'40101-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(184,46,'40101-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(185,47,'40102-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(186,47,'40102-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(187,47,'40102-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(188,47,'40102-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(189,48,'40103-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(190,48,'40103-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(191,48,'40103-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(192,48,'40103-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(193,49,'40104-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(194,49,'40104-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(195,49,'40104-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(196,49,'40104-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(197,50,'40105-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(198,50,'40105-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(199,50,'40105-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(200,50,'40105-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(201,51,'40201-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(202,51,'40201-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(203,51,'40201-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(204,51,'40201-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(205,52,'40202-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(206,52,'40202-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(207,52,'40202-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(208,52,'40202-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(209,53,'40203-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(210,53,'40203-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(211,53,'40203-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(212,53,'40203-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(213,54,'40204-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(214,54,'40204-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(215,54,'40204-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(216,54,'40204-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(217,55,'40205-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(218,55,'40205-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(219,55,'40205-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(220,55,'40205-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(221,56,'40301-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(222,56,'40301-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(223,56,'40301-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(224,56,'40301-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(225,57,'40302-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(226,57,'40302-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(227,57,'40302-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(228,57,'40302-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(229,58,'40303-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(230,58,'40303-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(231,58,'40303-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(232,58,'40303-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(233,59,'40304-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(234,59,'40304-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(235,59,'40304-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(236,59,'40304-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(237,60,'40305-1','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(238,60,'40305-2','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(239,60,'40305-3','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(240,60,'40305-4','available','2026-06-25 22:19:10','2026-06-25 22:19:10'),(241,61,'50101-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(242,61,'50101-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(243,61,'50101-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(244,61,'50101-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(245,62,'50102-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(246,62,'50102-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(247,62,'50102-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(248,62,'50102-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(249,63,'50103-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(250,63,'50103-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(251,63,'50103-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(252,63,'50103-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(253,64,'50104-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(254,64,'50104-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(255,64,'50104-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(256,64,'50104-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(257,65,'50105-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(258,65,'50105-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(259,65,'50105-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(260,65,'50105-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(261,66,'50201-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(262,66,'50201-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(263,66,'50201-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(264,66,'50201-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(265,67,'50202-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(266,67,'50202-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(267,67,'50202-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(268,67,'50202-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(269,68,'50203-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(270,68,'50203-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(271,68,'50203-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(272,68,'50203-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(273,69,'50204-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(274,69,'50204-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(275,69,'50204-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(276,69,'50204-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(277,70,'50205-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(278,70,'50205-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(279,70,'50205-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(280,70,'50205-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(281,71,'50301-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(282,71,'50301-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(283,71,'50301-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(284,71,'50301-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(285,72,'50302-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(286,72,'50302-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(287,72,'50302-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(288,72,'50302-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(289,73,'50303-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(290,73,'50303-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(291,73,'50303-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(292,73,'50303-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(293,74,'50304-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(294,74,'50304-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(295,74,'50304-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(296,74,'50304-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(297,75,'50305-1','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(298,75,'50305-2','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(299,75,'50305-3','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(300,75,'50305-4','available','2026-06-25 22:19:17','2026-06-25 22:19:17'),(301,76,'60101-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(302,76,'60101-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(303,76,'60101-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(304,76,'60101-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(305,77,'60102-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(306,77,'60102-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(307,77,'60102-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(308,77,'60102-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(309,78,'60103-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(310,78,'60103-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(311,78,'60103-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(312,78,'60103-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(313,79,'60104-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(314,79,'60104-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(315,79,'60104-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(316,79,'60104-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(317,80,'60105-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(318,80,'60105-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(319,80,'60105-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(320,80,'60105-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(321,81,'60201-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(322,81,'60201-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(323,81,'60201-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(324,81,'60201-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(325,82,'60202-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(326,82,'60202-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(327,82,'60202-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(328,82,'60202-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(329,83,'60203-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(330,83,'60203-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(331,83,'60203-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(332,83,'60203-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(333,84,'60204-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(334,84,'60204-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(335,84,'60204-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(336,84,'60204-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(337,85,'60205-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(338,85,'60205-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(339,85,'60205-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(340,85,'60205-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(341,86,'60301-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(342,86,'60301-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(343,86,'60301-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(344,86,'60301-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(345,87,'60302-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(346,87,'60302-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(347,87,'60302-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(348,87,'60302-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(349,88,'60303-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(350,88,'60303-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(351,88,'60303-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(352,88,'60303-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(353,89,'60304-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(354,89,'60304-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(355,89,'60304-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(356,89,'60304-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(357,90,'60305-1','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(358,90,'60305-2','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(359,90,'60305-3','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(360,90,'60305-4','available','2026-06-25 22:19:24','2026-06-25 22:19:24'),(361,91,'70101-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(362,91,'70101-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(363,91,'70101-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(364,91,'70101-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(365,92,'70102-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(366,92,'70102-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(367,92,'70102-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(368,92,'70102-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(369,93,'70103-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(370,93,'70103-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(371,93,'70103-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(372,93,'70103-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(373,94,'70104-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(374,94,'70104-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(375,94,'70104-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(376,94,'70104-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(377,95,'70105-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(378,95,'70105-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(379,95,'70105-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(380,95,'70105-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(381,96,'70201-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(382,96,'70201-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(383,96,'70201-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(384,96,'70201-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(385,97,'70202-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(386,97,'70202-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(387,97,'70202-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(388,97,'70202-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(389,98,'70203-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(390,98,'70203-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(391,98,'70203-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(392,98,'70203-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(393,99,'70204-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(394,99,'70204-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(395,99,'70204-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(396,99,'70204-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(397,100,'70205-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(398,100,'70205-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(399,100,'70205-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(400,100,'70205-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(401,101,'70301-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(402,101,'70301-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(403,101,'70301-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(404,101,'70301-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(405,102,'70302-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(406,102,'70302-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(407,102,'70302-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(408,102,'70302-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(409,103,'70303-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(410,103,'70303-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(411,103,'70303-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(412,103,'70303-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(413,104,'70304-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(414,104,'70304-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(415,104,'70304-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(416,104,'70304-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(417,105,'70305-1','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(418,105,'70305-2','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(419,105,'70305-3','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(420,105,'70305-4','available','2026-06-25 22:19:31','2026-06-25 22:19:31'),(421,106,'80101-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(422,106,'80101-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(423,106,'80101-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(424,106,'80101-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(425,107,'80102-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(426,107,'80102-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(427,107,'80102-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(428,107,'80102-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(429,108,'80103-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(430,108,'80103-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(431,108,'80103-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(432,108,'80103-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(433,109,'80104-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(434,109,'80104-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(435,109,'80104-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(436,109,'80104-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(437,110,'80105-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(438,110,'80105-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(439,110,'80105-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(440,110,'80105-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(441,111,'80201-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(442,111,'80201-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(443,111,'80201-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(444,111,'80201-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(445,112,'80202-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(446,112,'80202-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(447,112,'80202-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(448,112,'80202-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(449,113,'80203-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(450,113,'80203-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(451,113,'80203-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(452,113,'80203-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(453,114,'80204-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(454,114,'80204-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(455,114,'80204-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(456,114,'80204-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(457,115,'80205-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(458,115,'80205-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(459,115,'80205-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(460,115,'80205-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(461,116,'80301-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(462,116,'80301-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(463,116,'80301-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(464,116,'80301-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(465,117,'80302-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(466,117,'80302-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(467,117,'80302-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(468,117,'80302-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(469,118,'80303-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(470,118,'80303-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(471,118,'80303-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(472,118,'80303-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(473,119,'80304-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(474,119,'80304-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(475,119,'80304-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(476,119,'80304-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(477,120,'80305-1','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(478,120,'80305-2','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(479,120,'80305-3','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(480,120,'80305-4','available','2026-06-25 22:19:38','2026-06-25 22:19:38'),(481,121,'90101-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(482,121,'90101-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(483,121,'90101-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(484,121,'90101-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(485,122,'90102-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(486,122,'90102-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(487,122,'90102-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(488,122,'90102-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(489,123,'90103-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(490,123,'90103-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(491,123,'90103-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(492,123,'90103-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(493,124,'90104-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(494,124,'90104-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(495,124,'90104-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(496,124,'90104-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(497,125,'90105-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(498,125,'90105-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(499,125,'90105-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(500,125,'90105-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(501,126,'90201-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(502,126,'90201-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(503,126,'90201-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(504,126,'90201-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(505,127,'90202-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(506,127,'90202-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(507,127,'90202-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(508,127,'90202-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(509,128,'90203-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(510,128,'90203-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(511,128,'90203-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(512,128,'90203-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(513,129,'90204-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(514,129,'90204-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(515,129,'90204-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(516,129,'90204-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(517,130,'90205-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(518,130,'90205-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(519,130,'90205-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(520,130,'90205-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(521,131,'90301-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(522,131,'90301-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(523,131,'90301-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(524,131,'90301-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(525,132,'90302-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(526,132,'90302-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(527,132,'90302-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(528,132,'90302-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(529,133,'90303-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(530,133,'90303-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(531,133,'90303-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(532,133,'90303-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(533,134,'90304-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(534,134,'90304-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(535,134,'90304-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(536,134,'90304-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(537,135,'90305-1','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(538,135,'90305-2','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(539,135,'90305-3','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(540,135,'90305-4','available','2026-06-25 22:19:45','2026-06-25 22:19:45'),(541,136,'11','booked','2026-07-20 23:57:45','2026-07-20 23:57:45'),(542,137,'568','booked','2026-07-21 00:32:23','2026-07-21 00:32:23'),(543,138,'11','booked','2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1OBpp8OQIY5FLE3c1e3XxJqchJjoTl6UmUUL1Wuj',NULL,'103.73.47.73','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJUYzhUSURlaFJLa1ZLbzlnQ3RHTkRYVDljcTVHNDV3RUd3dUtMTkV5IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTE5LjE0OC4xNi4yMDQ6ODJcL3JlZ2lzdGVyIiwicm91dGUiOiJyZWdpc3RlciJ9fQ==',1784616626),('5zrwGwYo4NN98gFVnM691cd33PHNGiGwCYNT8smT',NULL,'163.227.144.138','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJ6eTF0TkpWQjF6T1FUOEdocTV4VFg4bzkzZFJDRTBkRzhmZW1OODgxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784613870),('635uV2w70bnPRMTyLjKvyaudXG6F63bD7L6KSnRx',NULL,'163.227.144.137','Mozilla/5.0 (Linux; Android 16; 25062RN2DA Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.46 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/570.0.0.34.87;]','eyJfdG9rZW4iOiJFenZZOHlWWUNydTlWdWNtUEJJM2VXUlBFQWpWZEVTUHlsejlGS2F5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9yZWdpc3RlciIsInJvdXRlIjoicmVnaXN0ZXIifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784625795),('BqlAT0mm3Ra1CfufeJkEFjliD78dfM4DX9rJFneu',NULL,'119.148.16.204','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJnSUpDWHd5ZDZ4aWpDY0FPZlpHTkZ4ZTlSeGF4aW5MVUtjYk5ad2lsIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTE5LjE0OC4xNi4yMDQ6ODJcL2Rhc2hib2FyZCJ9LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTE5LjE0OC4xNi4yMDQ6ODJcL2xvZ2luIiwicm91dGUiOiJsb2dpbiJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784602391),('br4tSqETAQidsgtqdAKG1XAknAUA84N9Hj2hhRYO',206,'37.111.242.56','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJqeDRUTG5xbXNscWVFZ3VTaVhzTFdrblU3SGh3VjhXTVZKUFpTMVBlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9kYXNoYm9hcmQiLCJyb3V0ZSI6ImRhc2hib2FyZCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoyMDZ9',1784615572),('F3LtKhbFamTiTlZ7DGBWcQue9InG1yMe5EzWNuDP',NULL,'103.132.249.62','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiI5M1UwYnc1T0hpOEpUMDVtYnpuYTczOHdYazRnbENrMHNYbWZhRnZWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9hcGlcL2Rpc3RhbmNlP2Rpc3RyaWN0PUJvZ3JhJnVwYXppbGFfaWQ9MjMxMjYzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784614730),('FBSwicE3561VTOVTxeFXZnbcZu2oAWBTTspWOh5t',NULL,'103.15.244.133','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJCdmlROVp5dWxKWFdkQWRWRWsyUWV2aXcyMjdJUVIycjBlelNrS1pvIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTE5LjE0OC4xNi4yMDQ6ODJcL2Rhc2hib2FyZCJ9LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTE5LjE0OC4xNi4yMDQ6ODJcL2xvZ2luIiwicm91dGUiOiJsb2dpbiJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784613483),('ndt4Uq340aFggINh7ZPwAAHkoh38bN1Xn41kqRA2',205,'119.148.16.204','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI4RzhVb1Nsd1ZvMnZKaGNJb01qdFJmOWVYTzVJYVAxcnpNcWFXY29sIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9hcGlcL2Rpc3RhbmNlP2Rpc3RyaWN0PUJhZ2VyaGF0JnVwYXppbGFfaWQ9MjMxNjEwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoyMDV9',1784615544),('NjML9eT4GuqDz4T3qpbZoWDKC9Ibl0i9N9C6CgQb',NULL,'34.62.149.255','python-requests/2.32.5','eyJfdG9rZW4iOiJGNElDSHRYRzB6QWVYYUtPSHJvN09jemFLa2N5OW5BcUFYRVRQNVMzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784622010),('qLM6iUtS4atzmucUm94EFBhCddnHjKwyKHKkhBhW',NULL,'85.217.149.32','Mozilla/5.0 (compatible; ModatScanner/1.2; +https://modat.io/)','eyJfdG9rZW4iOiJ1TGZxYndGYnpLQUhnbjFoeXc2N3FhZ1dFYkRCWnc1OVRabnJiWGdHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784604389),('rJdjKr0QuQLiH114S0UqXrvxJ72UEjVh0iH9WH2Q',NULL,'163.227.144.137','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJac1pOQ3p3YWZoT3p2YU9BS1lDdE5pRzZPWU5jZjFwZ0dVZU9sOVVJIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784624635),('S8vWlt2pzI62SACQ0xNdMJ0CuJWNQSqcbkO8ezqH',NULL,'85.217.149.10','Mozilla/5.0 (compatible; ModatScanner/1.2; +https://modat.io/)','eyJfdG9rZW4iOiJBdlFCTVVaTEpPeXlIV2dhWkV3MnpKZFBVc054S0M2MjE5VHhRUDFBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784615144),('sDxbiz7uNCXFzg1upIfmhZBngJdZUc1JPvMp5Bie',NULL,'103.132.249.62','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIySVh2SUFzNFRYQmpVU3UyR3ljdWZjdGVicDljM1ZFZk00ZDlLREF0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9hcGlcL2Rpc3RhbmNlP2Rpc3RyaWN0PURoYWthJnVwYXppbGFfaWQ9MjMxNTI0Iiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784614945),('tlf12ZARgQ3RpNf4MuaZvSTtFGhBFa74pogw8Cw5',207,'163.227.144.137','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiI1ZFFaSW5jbVBYSU5DRHZlalh3ZXhTRzFpSmNZNjJnb0JPYW41MkFvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9kYXNoYm9hcmQiLCJyb3V0ZSI6ImRhc2hib2FyZCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoyMDd9',1784617131),('uJe8kD6w6USwqLNlMTQg7Cez2tNruXzD1kP6z4wh',NULL,'163.227.144.137','Mozilla/5.0 (Linux; Android 12; vivo 1907_19 Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.46 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/570.0.0.34.87;]','eyJfdG9rZW4iOiJiMGdrcjNWSVpIcUgwdkxUbEVNMnB1QnJrd1htbFh3aXBGYnpsazlWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyXC9hcGlcL2Rpc3RhbmNlP2Rpc3RyaWN0PVN1bmFtZ2FuaiZ1cGF6aWxhX2lkPTIzMTQwMiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784624858),('vuImckAgvPyGouNePOFmWrMs65XrwyAgFqt4Qfyo',NULL,'163.227.144.138','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','eyJfdG9rZW4iOiJpTmFzM3N5RlVvMVlrZU9TNWsxM1NUbTU0cVFBUk5UMGRGajlRUHpYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzExOS4xNDguMTYuMjA0OjgyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784614097);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_profiles`
--

DROP TABLE IF EXISTS `staff_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `staff_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_profiles`
--

LOCK TABLES `staff_profiles` WRITE;
/*!40000 ALTER TABLE `staff_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_academics`
--

DROP TABLE IF EXISTS `student_academics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_academics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `student_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `degree` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int NOT NULL,
  `semester` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_cgpa` decimal(3,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_academics_user_id_unique` (`user_id`),
  UNIQUE KEY `student_academics_student_id_unique` (`student_id`),
  CONSTRAINT `student_academics_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_academics`
--

LOCK TABLES `student_academics` WRITE;
/*!40000 ALTER TABLE `student_academics` DISABLE KEYS */;
INSERT INTO `student_academics` VALUES (1,4,'19020101','Computer Science and Engineering','B.Sc. (Eng.)',3,'I',2.76,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,5,'19020102','Computer Science and Engineering','B.Sc. (Eng.)',1,'I',2.97,'2026-06-25 22:18:51','2026-06-25 22:18:51'),(21,26,'19020201','Computer Science and Engineering','B.Sc. (Eng.)',3,'II',2.79,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(22,27,'19020202','Computer Science and Engineering','B.Sc. (Eng.)',4,'II',3.71,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(41,48,'19020301','Computer Science and Engineering','B.Sc. (Eng.)',2,'II',2.52,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(42,49,'19020302','Computer Science and Engineering','B.Sc. (Eng.)',2,'I',3.43,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(61,70,'19020401','Computer Science and Engineering','B.Sc. (Eng.)',2,'I',3.54,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(62,71,'19020402','Computer Science and Engineering','B.Sc. (Eng.)',1,'II',2.81,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(81,92,'19020501','Computer Science and Engineering','B.Sc. (Eng.)',2,'II',2.90,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(82,93,'19020502','Computer Science and Engineering','B.Sc. (Eng.)',3,'II',3.22,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(101,114,'19020601','Computer Science and Engineering','B.Sc. (Eng.)',2,'I',3.32,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(102,115,'19020602','Computer Science and Engineering','B.Sc. (Eng.)',4,'II',2.56,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(121,136,'19020701','Computer Science and Engineering','B.Sc. (Eng.)',3,'II',3.41,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(122,137,'19020702','Computer Science and Engineering','B.Sc. (Eng.)',3,'I',3.52,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(141,158,'19020801','Computer Science and Engineering','B.Sc. (Eng.)',3,'II',2.97,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(142,159,'19020802','Computer Science and Engineering','B.Sc. (Eng.)',2,'I',3.21,'2026-06-25 22:19:39','2026-06-25 22:19:39'),(161,180,'19020901','Computer Science and Engineering','B.Sc. (Eng.)',3,'II',2.92,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(162,181,'19020902','Computer Science and Engineering','B.Sc. (Eng.)',2,'I',2.84,'2026-06-25 22:19:46','2026-06-25 22:19:46'),(185,204,'2302028','Computer Science and Engineering','B.Sc. (Engineering) in Computer Science and Engineering.',3,'I',3.50,'2026-07-20 23:57:45','2026-07-20 23:57:45'),(188,207,'2302039','Computer Science and Engineering','B.Sc. (Engineering) in Computer Science and Engineering.',3,'I',3.09,'2026-07-21 00:58:19','2026-07-21 00:58:19'),(189,208,'2302040','Computer Science and Engineering','B.Sc. (Engineering) in Computer Science and Engineering.',3,'I',3.40,'2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `student_academics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_addresses`
--

DROP TABLE IF EXISTS `student_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `perm_district` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perm_upazilla` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perm_village_area` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pres_district` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pres_upazilla` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pres_village_area` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance_from_home` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_addresses_user_id_unique` (`user_id`),
  CONSTRAINT `student_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_addresses`
--

LOCK TABLES `student_addresses` WRITE;
/*!40000 ALTER TABLE `student_addresses` DISABLE KEYS */;
INSERT INTO `student_addresses` VALUES (1,4,'Rajshahi','Rajshahi Upazilla','Rajshahi Area','Rajshahi','Rajshahi Upazilla','Rajshahi Area',215,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,5,'Bhola','Bhola Upazilla','Bhola Area','Bhola','Bhola Upazilla','Bhola Area',620,'2026-06-25 22:18:51','2026-06-25 22:18:51'),(21,26,'Satkhira','Satkhira Upazilla','Satkhira Area','Satkhira','Satkhira Upazilla','Satkhira Area',460,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(22,27,'Jhalokathi','Jhalokathi Upazilla','Jhalokathi Area','Jhalokathi','Jhalokathi Upazilla','Jhalokathi Area',545,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(41,48,'Faridpur','Faridpur Upazilla','Faridpur Area','Faridpur','Faridpur Upazilla','Faridpur Area',390,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(42,49,'Pabna','Pabna Upazilla','Pabna Area','Pabna','Pabna Upazilla','Pabna Area',275,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(61,70,'Natore','Natore Upazilla','Natore Area','Natore','Natore Upazilla','Natore Area',220,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(62,71,'Manikganj','Manikganj Upazilla','Manikganj Area','Manikganj','Manikganj Upazilla','Manikganj Area',310,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(81,92,'Thakurgaon','Thakurgaon Upazilla','Thakurgaon Area','Thakurgaon','Thakurgaon Upazilla','Thakurgaon Area',80,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(82,93,'Moulvibazar','Moulvibazar Upazilla','Moulvibazar Area','Moulvibazar','Moulvibazar Upazilla','Moulvibazar Area',495,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(101,114,'Mymensingh','Mymensingh Upazilla','Mymensingh Area','Mymensingh','Mymensingh Upazilla','Mymensingh Area',310,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(102,115,'Naogaon','Naogaon Upazilla','Naogaon Area','Naogaon','Naogaon Upazilla','Naogaon Area',150,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(121,136,'Bandarban','Bandarban Upazilla','Bandarban Area','Bandarban','Bandarban Upazilla','Bandarban Area',680,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(122,137,'Chuadanga','Chuadanga Upazilla','Chuadanga Area','Chuadanga','Chuadanga Upazilla','Chuadanga Area',330,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(141,158,'Rangamati','Rangamati Upazilla','Rangamati Area','Rangamati','Rangamati Upazilla','Rangamati Area',650,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(142,159,'Chattogram','Chattogram Upazilla','Chattogram Area','Chattogram','Chattogram Upazilla','Chattogram Area',590,'2026-06-25 22:19:39','2026-06-25 22:19:39'),(161,180,'Gazipur','Gazipur Upazilla','Gazipur Area','Gazipur','Gazipur Upazilla','Gazipur Area',320,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(162,181,'Jhalokathi','Jhalokathi Upazilla','Jhalokathi Area','Jhalokathi','Jhalokathi Upazilla','Jhalokathi Area',545,'2026-06-25 22:19:46','2026-06-25 22:19:46'),(185,204,'Mymensingh','Nandail','Shaildora','Mymensingh','Nandail','Nandail',337,'2026-07-20 23:57:45','2026-07-20 23:57:45'),(188,207,'Gazipur','Kapasia','Kapasia upazila porisod','Gazipur','Kapasia','Kapasia upazila porisod',338,'2026-07-21 00:58:19','2026-07-21 00:58:19'),(189,208,'Sunamganj','Bishwambarpur','Dhonpjr','Sunamganj','Bishwambarpur','Dhonpjr',574,'2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `student_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_guardians`
--

DROP TABLE IF EXISTS `student_guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_guardians` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `father_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_occupation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annual_income_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_guardians_user_id_unique` (`user_id`),
  CONSTRAINT `student_guardians_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_guardians`
--

LOCK TABLES `student_guardians` WRITE;
/*!40000 ALTER TABLE `student_guardians` DISABLE KEYS */;
INSERT INTO `student_guardians` VALUES (1,4,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',153599.00,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,5,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',118921.00,'2026-06-25 22:18:51','2026-06-25 22:18:51'),(21,26,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',496549.00,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(22,27,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',347472.00,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(41,48,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',178190.00,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(42,49,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',172787.00,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(61,70,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',398288.00,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(62,71,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',213435.00,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(81,92,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',348527.00,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(82,93,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',218868.00,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(101,114,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',149165.00,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(102,115,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',200132.00,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(121,136,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',437629.00,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(122,137,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',245764.00,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(141,158,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',361037.00,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(142,159,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',376489.00,'2026-06-25 22:19:39','2026-06-25 22:19:39'),(161,180,'Father of Student 1','Mother of Student 1','Father of Student 1','Serviceholder',475208.00,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(162,181,'Father of Student 2','Mother of Student 2','Father of Student 2','Serviceholder',325814.00,'2026-06-25 22:19:46','2026-06-25 22:19:46'),(185,204,'Jugesh chandra',NULL,'Jugesh chandra','Farmer',5000.00,'2026-07-20 23:57:45','2026-07-20 23:57:45'),(188,207,'Tofazzal Hossain','Suraya Akter','Tofazzal Hossain','Teacher',300000.00,'2026-07-21 00:58:19','2026-07-21 00:58:19'),(189,208,'Jalal uddin','Hosna ara khatun','Jalal uddin','Business',100000.00,'2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `student_guardians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_residentials`
--

DROP TABLE IF EXISTS `student_residentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_residentials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `status` enum('Residential','Non-Residential') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Non-Residential',
  `hall_id` bigint unsigned DEFAULT NULL,
  `seat_id` bigint unsigned DEFAULT NULL,
  `staying_from` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_residentials_user_id_unique` (`user_id`),
  KEY `student_residentials_hall_id_foreign` (`hall_id`),
  KEY `student_residentials_seat_id_foreign` (`seat_id`),
  CONSTRAINT `student_residentials_hall_id_foreign` FOREIGN KEY (`hall_id`) REFERENCES `halls` (`id`) ON DELETE SET NULL,
  CONSTRAINT `student_residentials_seat_id_foreign` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE SET NULL,
  CONSTRAINT `student_residentials_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_residentials`
--

LOCK TABLES `student_residentials` WRITE;
/*!40000 ALTER TABLE `student_residentials` DISABLE KEYS */;
INSERT INTO `student_residentials` VALUES (1,4,'Non-Residential',1,NULL,NULL,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,5,'Non-Residential',1,NULL,NULL,'2026-06-25 22:18:51','2026-06-25 22:18:51'),(21,26,'Non-Residential',2,NULL,NULL,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(22,27,'Non-Residential',2,NULL,NULL,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(41,48,'Non-Residential',3,NULL,NULL,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(42,49,'Non-Residential',3,NULL,NULL,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(61,70,'Non-Residential',4,NULL,NULL,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(62,71,'Non-Residential',4,NULL,NULL,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(81,92,'Non-Residential',5,NULL,NULL,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(82,93,'Non-Residential',5,NULL,NULL,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(101,114,'Non-Residential',6,NULL,NULL,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(102,115,'Non-Residential',6,NULL,NULL,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(121,136,'Non-Residential',7,NULL,NULL,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(122,137,'Non-Residential',7,NULL,NULL,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(141,158,'Non-Residential',8,NULL,NULL,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(142,159,'Non-Residential',8,NULL,NULL,'2026-06-25 22:19:39','2026-06-25 22:19:39'),(161,180,'Non-Residential',9,NULL,NULL,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(162,181,'Non-Residential',9,NULL,NULL,'2026-06-25 22:19:46','2026-06-25 22:19:46'),(185,204,'Residential',2,541,'2025-07-21','2026-07-20 23:57:45','2026-07-20 23:57:45'),(188,207,'Non-Residential',NULL,NULL,NULL,'2026-07-21 00:58:19','2026-07-21 00:58:19'),(189,208,'Residential',5,543,'2025-07-21','2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `student_residentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_profiles`
--

DROP TABLE IF EXISTS `teacher_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `teacher_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_profiles`
--

LOCK TABLES `teacher_profiles` WRITE;
/*!40000 ALTER TABLE `teacher_profiles` DISABLE KEYS */;
INSERT INTO `teacher_profiles` VALUES (1,3,'Professor','Computer Science and Engineering','2026-06-25 22:18:50','2026-06-25 22:18:50'),(2,25,'Professor','Computer Science and Engineering','2026-06-25 22:18:56','2026-06-25 22:18:56'),(3,47,'Professor','Computer Science and Engineering','2026-06-25 22:19:03','2026-06-25 22:19:03'),(4,69,'Professor','Computer Science and Engineering','2026-06-25 22:19:10','2026-06-25 22:19:10'),(5,91,'Professor','Computer Science and Engineering','2026-06-25 22:19:17','2026-06-25 22:19:17'),(6,113,'Professor','Computer Science and Engineering','2026-06-25 22:19:24','2026-06-25 22:19:24'),(7,135,'Professor','Computer Science and Engineering','2026-06-25 22:19:31','2026-06-25 22:19:31'),(8,157,'Professor','Computer Science and Engineering','2026-06-25 22:19:38','2026-06-25 22:19:38'),(9,179,'Professor','Computer Science and Engineering','2026-06-25 22:19:45','2026-06-25 22:19:45');
/*!40000 ALTER TABLE `teacher_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','hall_super','assistant_hall_super','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `hall_id` bigint unsigned DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Admin','admin@example.com',NULL,'$2y$12$ChK9UB3JVxxEq9U7Gd/yGepr1n.kjfqzttzOfz3pNPaFcNeAAN3re',NULL,NULL,NULL,'admin',NULL,NULL,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(2,'Shaheed Nur Hossain Hall Admin','admin.shaheednurhossainhall@example.com',NULL,'$2y$12$RIONYbHv7BCErno17dspsucYmEPz1KCPd6BaUtOWO8o6Qw0g1Vtp6',NULL,NULL,NULL,'admin',1,NULL,'2026-06-25 22:18:49','2026-06-25 22:18:49'),(3,'Prof. Shaheed Nur Hossain Hall Super','super.shaheednurhossainhall@example.com',NULL,'$2y$12$GgmPwvOIEI51fTqpT68UVOf6E.QgwSd0BVeCMMnFtNCmUL1Pklyqe',NULL,NULL,NULL,'hall_super',1,NULL,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(4,'Student 1 of Shaheed Nur Hossain Hall','student1.shaheednurhossainhall@example.com',NULL,'$2y$12$SZUI/iYnH92uB9.59R6afuPEugx4Wtyu2tAbFK99uBZ1BmT6D6DGO',NULL,NULL,NULL,'student',1,NULL,'2026-06-25 22:18:50','2026-06-25 22:18:50'),(5,'Student 2 of Shaheed Nur Hossain Hall','student2.shaheednurhossainhall@example.com',NULL,'$2y$12$sFpaghF11SqULGBE4zC/lOqztg47l/STYTN8FELZ9pW.7ScDntdrO',NULL,NULL,NULL,'student',1,NULL,'2026-06-25 22:18:51','2026-06-25 22:18:51'),(24,'Shaheed President Ziaur Rahman Hall Admin','admin.shaheedpresidentziaurrahmanhall@example.com',NULL,'$2y$12$5LxmdKym4AF.GB.XHBLwuOu.SGXLXXLjgB.MDNLafqCx9ebEjppN2',NULL,NULL,NULL,'admin',2,NULL,'2026-06-25 22:18:56','2026-06-25 22:18:56'),(25,'Prof. Shaheed President Ziaur Rahman Hall Super','super.shaheedpresidentziaurrahmanhall@example.com',NULL,'$2y$12$qA2U4im6XitUM3RtpQdPUevnIVfem0UaA8tfvzDu6LzgXcA58GmKC',NULL,NULL,NULL,'hall_super',2,NULL,'2026-06-25 22:18:56','2026-06-25 22:18:56'),(26,'Student 1 of Shaheed President Ziaur Rahman Hall','student1.shaheedpresidentziaurrahmanhall@example.com',NULL,'$2y$12$j72qpARnya/xWdnPRXHv2uh/lQ.NPz20fYL3HwWvUUebGVKwIHTPq',NULL,NULL,NULL,'student',2,NULL,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(27,'Student 2 of Shaheed President Ziaur Rahman Hall','student2.shaheedpresidentziaurrahmanhall@example.com',NULL,'$2y$12$IMuta.sWTgzB4bqusSTM3O8wXOzc7I.5hgcOI3/KZ3Kq7yok2ql8W',NULL,NULL,NULL,'student',2,NULL,'2026-06-25 22:18:57','2026-06-25 22:18:57'),(46,'Shaheed Abrar Fahad Hall Admin','admin.shaheedabrarfahadhall@example.com',NULL,'$2y$12$PKCIzWBdWga7TM7lw5nf4.GJWG40QE.drRMkqETRr2oaGTkO5SlAq',NULL,NULL,NULL,'admin',3,NULL,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(47,'Prof. Shaheed Abrar Fahad Hall Super','super.shaheedabrarfahadhall@example.com',NULL,'$2y$12$Jm3guXcb2UeU7H8Li1b6z.R1Zrbcfqc5S5JOiY5pZiIYXYwA61dWC',NULL,NULL,NULL,'hall_super',3,NULL,'2026-06-25 22:19:03','2026-06-25 22:19:03'),(48,'Student 1 of Shaheed Abrar Fahad Hall','student1.shaheedabrarfahadhall@example.com',NULL,'$2y$12$dMPRkO8o/Y.4mGfcVSAHnOJBbT722Ogo5QW9LJO2BfqpLrhv7gu5y',NULL,NULL,NULL,'student',3,NULL,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(49,'Student 2 of Shaheed Abrar Fahad Hall','student2.shaheedabrarfahadhall@example.com',NULL,'$2y$12$E1byVeAZS3bV/sfr98j1O.HU4.g9cVFBmLWXzWjSTXteU2olS.TyG',NULL,NULL,NULL,'student',3,NULL,'2026-06-25 22:19:04','2026-06-25 22:19:04'),(68,'International Hall Admin','admin.internationalhall@example.com',NULL,'$2y$12$0yVxDTUwONt78gsL0qRtXuDK3.jU2qkQv8.Fg2wGzwHSjCXX9lf.e',NULL,NULL,NULL,'admin',4,NULL,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(69,'Prof. International Hall Super','super.internationalhall@example.com',NULL,'$2y$12$LG1hHlArbAFLGRF60JtvCO3zKq6TMEu2EaLSd/T3bj88UvGppT6wW',NULL,NULL,NULL,'hall_super',4,NULL,'2026-06-25 22:19:10','2026-06-25 22:19:10'),(70,'Student 1 of International Hall','student1.internationalhall@example.com',NULL,'$2y$12$G77F2jUItnQdTTlLIhQCjObUXRkL7KW7wuoVHJCH6tXsj3coKYv0G',NULL,NULL,NULL,'student',4,NULL,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(71,'Student 2 of International Hall','student2.internationalhall@example.com',NULL,'$2y$12$cL5MPTj1/3lEZ9RaD3lILOELtqwxUH//RAox8wcs6Sx6bFHTOdhOu',NULL,NULL,NULL,'student',4,NULL,'2026-06-25 22:19:11','2026-06-25 22:19:11'),(90,'Bijoy 24 Hall Admin','admin.bijoy24hall@example.com',NULL,'$2y$12$ufhd2aX4.LiLgWUjeHUVmutKiDZqo3buuQxsAYP9yWYstv9Venaz6',NULL,NULL,NULL,'admin',5,NULL,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(91,'Prof. Bijoy 24 Hall Super','super.bijoy24hall@example.com',NULL,'$2y$12$v7IK1W9FzKlmbRy9Vvun3O5/ygjgyhsI0Xi6CvEWaTd7tVjnX4JFO',NULL,NULL,NULL,'hall_super',5,NULL,'2026-06-25 22:19:17','2026-06-25 22:19:17'),(92,'Student 1 of Bijoy 24 Hall','student1.bijoy24hall@example.com',NULL,'$2y$12$nSowD3Zp8PTY8LrxWdyH9.BfX.co0qTAUgA9rJ9OQgV0ZmBT4MM7O',NULL,NULL,NULL,'student',5,NULL,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(93,'Student 2 of Bijoy 24 Hall','student2.bijoy24hall@example.com',NULL,'$2y$12$JqIw2Ck2klbYIsfxfIT3BOu0/qGFU6cS7C/i0brVzJnRtvW5fbILO',NULL,NULL,NULL,'student',5,NULL,'2026-06-25 22:19:18','2026-06-25 22:19:18'),(112,'Begum Rokeya Hall Admin','admin.begumrokeyahall@example.com',NULL,'$2y$12$hsklLBwM7GaPPDTtA/L2kuS0Rk7b/tlpCyfZqoxDLByAhu.7O.53e',NULL,NULL,NULL,'admin',6,NULL,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(113,'Prof. Begum Rokeya Hall Super','super.begumrokeyahall@example.com',NULL,'$2y$12$npiPx7iVN9DUQTtvyY4OVezBWSrIib3SCDb/mfxkP5E6egNpLjM8q',NULL,NULL,NULL,'hall_super',6,NULL,'2026-06-25 22:19:24','2026-06-25 22:19:24'),(114,'Student 1 of Begum Rokeya Hall','student1.begumrokeyahall@example.com',NULL,'$2y$12$K.z1WJTCFqthTljy0x5XE.P.F9jqnuxY7NPmupl3ulz7ITq45KJDG',NULL,NULL,NULL,'student',6,NULL,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(115,'Student 2 of Begum Rokeya Hall','student2.begumrokeyahall@example.com',NULL,'$2y$12$wwpRhCSqZVIL34oVi5T1j.WO.DktHxW/eJLV2n4pXPe42.JO0ibuG',NULL,NULL,NULL,'student',6,NULL,'2026-06-25 22:19:25','2026-06-25 22:19:25'),(134,'Nawab Faizunnesa Hall Admin','admin.nawabfaizunnesahall@example.com',NULL,'$2y$12$4K6M5luBnwHRoVYn5.3UQuWygc5GbQGw.heqTx6ztO2UwmEeMzCIm',NULL,NULL,NULL,'admin',7,NULL,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(135,'Prof. Nawab Faizunnesa Hall Super','super.nawabfaizunnesahall@example.com',NULL,'$2y$12$Dc4vMhFXNyiJzjRrG2co3u4AXFTQcuNNNtYVLYkfwaLW05fgbu8um',NULL,NULL,NULL,'hall_super',7,NULL,'2026-06-25 22:19:31','2026-06-25 22:19:31'),(136,'Student 1 of Nawab Faizunnesa Hall','student1.nawabfaizunnesahall@example.com',NULL,'$2y$12$nLYxhgMJ6te3GV9fNyVLD.2wp8BSI7WLh5Nt/ZonjEs7OstoEn4zi',NULL,NULL,NULL,'student',7,NULL,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(137,'Student 2 of Nawab Faizunnesa Hall','student2.nawabfaizunnesahall@example.com',NULL,'$2y$12$cZiCVuh8H6wjn8SzgLzMsuZq.qI.DE6OkpxSfZAuA6cMoWPFM6roW',NULL,NULL,NULL,'student',7,NULL,'2026-06-25 22:19:32','2026-06-25 22:19:32'),(156,'Kobi Sufia Kamal Hall Admin','admin.kobisufiakamalhall@example.com',NULL,'$2y$12$a5C9jQTTZmAbfABPl2KfcePEJTzZ3OwLLjrY3x6Ryc3m4RirKAZOC',NULL,NULL,NULL,'admin',8,NULL,'2026-06-25 22:19:37','2026-06-25 22:19:37'),(157,'Prof. Kobi Sufia Kamal Hall Super','super.kobisufiakamalhall@example.com',NULL,'$2y$12$aJzOkJ/XchyjavdFG963sOA8l3zI4xCO4pwidlWtH1zbq/JOMEgTa',NULL,NULL,NULL,'hall_super',8,NULL,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(158,'Student 1 of Kobi Sufia Kamal Hall','student1.kobisufiakamalhall@example.com',NULL,'$2y$12$IV0PMs6z7yC2A85YUN4WFu.OPIkDLeGZ/GjaY/.EwhI1jK3kDOqtW',NULL,NULL,NULL,'student',8,NULL,'2026-06-25 22:19:38','2026-06-25 22:19:38'),(159,'Student 2 of Kobi Sufia Kamal Hall','student2.kobisufiakamalhall@example.com',NULL,'$2y$12$YE/0iIyD7Ra4TCw789q3RO3mtLGuxN2XDRU/.hs3gDXWsnLq4N9Gu',NULL,NULL,NULL,'student',8,NULL,'2026-06-25 22:19:39','2026-06-25 22:19:39'),(178,'Khurshid Zahan Haque Hall Admin','admin.khurshidzahanhaquehall@example.com',NULL,'$2y$12$Pm3II8fKBtUmBmWjlQFKe.csXXcbXS2PkVs79Qp53sDQ5lczTbRDm',NULL,NULL,NULL,'admin',9,NULL,'2026-06-25 22:19:44','2026-06-25 22:19:44'),(179,'Prof. Khurshid Zahan Haque Hall Super','super.khurshidzahanhaquehall@example.com',NULL,'$2y$12$PyXXcBCI4j9SilSaVuDc4uyksmXJ.QS2I0SmUSoJOLoASqYhu3EG.',NULL,NULL,NULL,'hall_super',9,NULL,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(180,'Student 1 of Khurshid Zahan Haque Hall','student1.khurshidzahanhaquehall@example.com',NULL,'$2y$12$9NExyEnWjXpyOjgEwHkLROEQKY3V.E6I/6EY7CuMxOUApAMGmaXyK',NULL,NULL,NULL,'student',9,NULL,'2026-06-25 22:19:45','2026-06-25 22:19:45'),(181,'Student 2 of Khurshid Zahan Haque Hall','student2.khurshidzahanhaquehall@example.com',NULL,'$2y$12$Ho.knBVPXb3UBzit.VFFbe4F.LXHRNWQOTKuqZ7jG9gVrIBr8IpvO',NULL,NULL,NULL,'student',9,NULL,'2026-06-25 22:19:46','2026-06-25 22:19:46'),(204,'Ronjit sorker','ronnjitrobidas108@mail.com',NULL,'$2y$12$02oZzGcz8614XntFhZ.UC.5jSGtB9vLpXeGjAcgwB/KX9VBrVx.a2',NULL,NULL,NULL,'student',2,NULL,'2026-07-20 23:57:45','2026-07-20 23:57:45'),(207,'Ahanaf Adil Showmik','showmik232@gmail.com',NULL,'$2y$12$bQsunfh0eEYTRdAzoS1KR.DqkYFLSI2xzS3DpH2V3vgWXbFZc/jL6',NULL,NULL,NULL,'student',NULL,NULL,'2026-07-21 00:58:19','2026-07-21 00:58:19'),(208,'Mahmudul hasan abin','mahmudulabin@gmail.com',NULL,'$2y$12$5GEOn5JT98reY9lHI8HGlONzrn9j36YtnKDLjS6MghGVfbOn9xnAy',NULL,NULL,NULL,'student',5,NULL,'2026-07-21 03:03:35','2026-07-21 03:03:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-21 18:33:36
