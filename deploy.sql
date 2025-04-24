/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: jwt
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `progress_tracking`
--

DROP TABLE IF EXISTS `progress_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_tracking` (
  `date` date DEFAULT NULL,
  `progress_value` double DEFAULT NULL,
  `progress_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `goal` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`progress_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_tracking`
--

LOCK TABLES `progress_tracking` WRITE;
/*!40000 ALTER TABLE `progress_tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relaxation_routine`
--

DROP TABLE IF EXISTS `relaxation_routine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `relaxation_routine` (
  `routine_start_time` time(6) DEFAULT NULL,
  `routineid` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `routine_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`routineid`),
  KEY `FKthd93qxxdk88bdhpq4lwh94rn` (`user_id`),
  CONSTRAINT `FKthd93qxxdk88bdhpq4lwh94rn` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relaxation_routine`
--

LOCK TABLES `relaxation_routine` WRITE;
/*!40000 ALTER TABLE `relaxation_routine` DISABLE KEYS */;
/*!40000 ALTER TABLE `relaxation_routine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sleep_schedule`
--

DROP TABLE IF EXISTS `sleep_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sleep_schedule` (
  `is_active` bit(1) NOT NULL,
  `is_staff` bit(1) NOT NULL,
  `preferred_wake_time` time(6) DEFAULT NULL,
  `sleep_time` time(6) DEFAULT NULL,
  `wake_time` time(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `sleep_goals` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKku7mhduneefind08uyqekgfyw` (`user_id`),
  CONSTRAINT `FKku7mhduneefind08uyqekgfyw` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sleep_schedule`
--

LOCK TABLES `sleep_schedule` WRITE;
/*!40000 ALTER TABLE `sleep_schedule` DISABLE KEYS */;
INSERT INTO `sleep_schedule` VALUES
(0x01,0x00,'06:30:00.000000','22:00:00.000000','06:00:00.000000',1,1,'Default sleep goal'),
(0x01,0x00,'06:30:00.000000','22:00:00.000000','06:00:00.000000',2,1,'Default sleep goal');
/*!40000 ALTER TABLE `sleep_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sleep_track`
--

DROP TABLE IF EXISTS `sleep_track`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sleep_track` (
  `date` date DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `sleep_duration` double DEFAULT NULL,
  `tracking_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userid` bigint(20) NOT NULL,
  `sleep_time` varchar(255) DEFAULT NULL,
  `tasks` text DEFAULT NULL,
  `wake_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tracking_id`),
  KEY `FK8s8ooikw182oudxwqgl1e54df` (`userid`),
  CONSTRAINT `FK8s8ooikw182oudxwqgl1e54df` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sleep_track`
--

LOCK TABLES `sleep_track` WRITE;
/*!40000 ALTER TABLE `sleep_track` DISABLE KEYS */;
/*!40000 ALTER TABLE `sleep_track` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smart_alarm`
--

DROP TABLE IF EXISTS `smart_alarm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `smart_alarm` (
  `alarm_time` time(6) DEFAULT NULL,
  `alarmid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`alarmid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smart_alarm`
--

LOCK TABLES `smart_alarm` WRITE;
/*!40000 ALTER TABLE `smart_alarm` DISABLE KEYS */;
/*!40000 ALTER TABLE `smart_alarm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(1,'cocoy1@gmail.com','cocoy','yong','123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-04-23 20:59:33
