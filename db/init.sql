-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: kwadb
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `area_area`
--

DROP TABLE IF EXISTS `area_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area_area` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `area_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_area`
--

LOCK TABLES `area_area` WRITE;
/*!40000 ALTER TABLE `area_area` DISABLE KEYS */;
/*!40000 ALTER TABLE `area_area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_user'),(22,'Can change user',6,'change_user'),(23,'Can delete user',6,'delete_user'),(24,'Can view user',6,'view_user'),(25,'Can add role',7,'add_role'),(26,'Can change role',7,'change_role'),(27,'Can delete role',7,'delete_role'),(28,'Can view role',7,'view_role'),(29,'Can add permission',8,'add_permission'),(30,'Can change permission',8,'change_permission'),(31,'Can delete permission',8,'delete_permission'),(32,'Can view permission',8,'view_permission'),(33,'Can add area',9,'add_area'),(34,'Can change area',9,'change_area'),(35,'Can delete area',9,'delete_area'),(36,'Can view area',9,'view_area'),(37,'Can add complaint',10,'add_complaint'),(38,'Can change complaint',10,'change_complaint'),(39,'Can delete complaint',10,'delete_complaint'),(40,'Can view complaint',10,'view_complaint'),(41,'Can add valve',11,'add_valve'),(42,'Can change valve',11,'change_valve'),(43,'Can delete valve',11,'delete_valve'),(44,'Can view valve',11,'view_valve'),(45,'Can add valve log',12,'add_valvelog'),(46,'Can change valve log',12,'change_valvelog'),(47,'Can delete valve log',12,'delete_valvelog'),(48,'Can view valve log',12,'view_valvelog'),(49,'Can add connection type',13,'add_connectiontype'),(50,'Can change connection type',13,'change_connectiontype'),(51,'Can delete connection type',13,'delete_connectiontype'),(52,'Can view connection type',13,'view_connectiontype'),(53,'Can add connection',14,'add_connection'),(54,'Can change connection',14,'change_connection'),(55,'Can delete connection',14,'delete_connection'),(56,'Can view connection',14,'view_connection'),(57,'Can add conversion',15,'add_conversion'),(58,'Can change conversion',15,'change_conversion'),(59,'Can delete conversion',15,'delete_conversion'),(60,'Can view conversion',15,'view_conversion');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authapp_permission`
--

DROP TABLE IF EXISTS `authapp_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authapp_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `page` varchar(100) NOT NULL,
  `can_view` tinyint(1) NOT NULL,
  `can_add` tinyint(1) NOT NULL,
  `can_edit` tinyint(1) NOT NULL,
  `can_delete` tinyint(1) NOT NULL,
  `role_id` bigint NOT NULL,
  `is_login_page` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authapp_permission_role_id_page_2789f33f_uniq` (`role_id`,`page`),
  CONSTRAINT `authapp_permission_role_id_4ab5eac4_fk_authapp_role_id` FOREIGN KEY (`role_id`) REFERENCES `authapp_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_permission`
--

LOCK TABLES `authapp_permission` WRITE;
/*!40000 ALTER TABLE `authapp_permission` DISABLE KEYS */;
INSERT INTO `authapp_permission` VALUES (1,'dashboard',1,1,1,1,1,0),(2,'profile',1,1,1,1,1,0),(3,'user_management',1,1,1,1,1,0),(4,'role',1,1,1,1,1,0),(5,'permission',1,1,1,1,1,0);
/*!40000 ALTER TABLE `authapp_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authapp_role`
--

DROP TABLE IF EXISTS `authapp_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authapp_role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_role`
--

LOCK TABLES `authapp_role` WRITE;
/*!40000 ALTER TABLE `authapp_role` DISABLE KEYS */;
INSERT INTO `authapp_role` VALUES (1,'Superadmin','can access the full page.');
/*!40000 ALTER TABLE `authapp_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authapp_user`
--

DROP TABLE IF EXISTS `authapp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authapp_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `role_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `authapp_user_role_id_5f3b5c3d_fk_authapp_role_id` (`role_id`),
  CONSTRAINT `authapp_user_role_id_5f3b5c3d_fk_authapp_role_id` FOREIGN KEY (`role_id`) REFERENCES `authapp_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_user`
--

LOCK TABLES `authapp_user` WRITE;
/*!40000 ALTER TABLE `authapp_user` DISABLE KEYS */;
INSERT INTO `authapp_user` VALUES (1,'pbkdf2_sha256$870000$MLthvmSbGYFfrAtE0KkjxZ$jUWi8SYgc/mgmzT0avnt4mOnogQMY/P3/89dF9a4O/A=','2025-04-25 19:33:57.000000',1,'Marketbytes','Devops',1,1,'2025-04-25 19:33:44.000000','marketbytesdevops@gmail.com','','marketbytesdevops',1);
/*!40000 ALTER TABLE `authapp_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authapp_user_groups`
--

DROP TABLE IF EXISTS `authapp_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authapp_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authapp_user_groups_user_id_group_id_532435ff_uniq` (`user_id`,`group_id`),
  KEY `authapp_user_groups_group_id_361087d7_fk_auth_group_id` (`group_id`),
  CONSTRAINT `authapp_user_groups_group_id_361087d7_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `authapp_user_groups_user_id_aad8a001_fk_authapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `authapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_user_groups`
--

LOCK TABLES `authapp_user_groups` WRITE;
/*!40000 ALTER TABLE `authapp_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `authapp_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authapp_user_user_permissions`
--

DROP TABLE IF EXISTS `authapp_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authapp_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authapp_user_user_permis_user_id_permission_id_d73ed934_uniq` (`user_id`,`permission_id`),
  KEY `authapp_user_user_pe_permission_id_ea3ff82e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `authapp_user_user_pe_permission_id_ea3ff82e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `authapp_user_user_pe_user_id_fb111ce4_fk_authapp_u` FOREIGN KEY (`user_id`) REFERENCES `authapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_user_user_permissions`
--

LOCK TABLES `authapp_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `authapp_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `authapp_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints_complaint`
--

DROP TABLE IF EXISTS `complaints_complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints_complaint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `serial_no` varchar(255) NOT NULL,
  `complaint_type` varchar(255) NOT NULL,
  `ticket_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `address` longtext NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `department` varchar(255) NOT NULL,
  `area_id` bigint NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `complaints_complaint_serial_no_2a2614e3_uniq` (`serial_no`),
  UNIQUE KEY `complaints_complaint_ticket_number_bfcfca5d_uniq` (`ticket_number`),
  KEY `complaints_complaint_area_id_a0673580_fk_area_area_id` (`area_id`),
  CONSTRAINT `complaints_complaint_area_id_a0673580_fk_area_area_id` FOREIGN KEY (`area_id`) REFERENCES `area_area` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints_complaint`
--

LOCK TABLES `complaints_complaint` WRITE;
/*!40000 ALTER TABLE `complaints_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaints_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connectiontype_connection`
--

DROP TABLE IF EXISTS `connectiontype_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `connectiontype_connection` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` longtext NOT NULL,
  `file_number` varchar(50) NOT NULL,
  `area` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `connection_type_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_number` (`file_number`),
  KEY `connectiontype_conne_connection_type_id_d664c263_fk_connectio` (`connection_type_id`),
  CONSTRAINT `connectiontype_conne_connection_type_id_d664c263_fk_connectio` FOREIGN KEY (`connection_type_id`) REFERENCES `connectiontype_connectiontype` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connectiontype_connection`
--

LOCK TABLES `connectiontype_connection` WRITE;
/*!40000 ALTER TABLE `connectiontype_connection` DISABLE KEYS */;
/*!40000 ALTER TABLE `connectiontype_connection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connectiontype_connectiontype`
--

DROP TABLE IF EXISTS `connectiontype_connectiontype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `connectiontype_connectiontype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connectiontype_connectiontype`
--

LOCK TABLES `connectiontype_connectiontype` WRITE;
/*!40000 ALTER TABLE `connectiontype_connectiontype` DISABLE KEYS */;
/*!40000 ALTER TABLE `connectiontype_connectiontype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversion_conversion`
--

DROP TABLE IF EXISTS `conversion_conversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversion_conversion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` longtext NOT NULL,
  `file_number` varchar(100) NOT NULL,
  `area` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `from_connection_type_id` bigint NOT NULL,
  `to_connection_type_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_number` (`file_number`),
  KEY `conversion_conversio_from_connection_type_21d094ed_fk_connectio` (`from_connection_type_id`),
  KEY `conversion_conversio_to_connection_type_i_39cabea7_fk_connectio` (`to_connection_type_id`),
  CONSTRAINT `conversion_conversio_from_connection_type_21d094ed_fk_connectio` FOREIGN KEY (`from_connection_type_id`) REFERENCES `connectiontype_connectiontype` (`id`),
  CONSTRAINT `conversion_conversio_to_connection_type_i_39cabea7_fk_connectio` FOREIGN KEY (`to_connection_type_id`) REFERENCES `connectiontype_connectiontype` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversion_conversion`
--

LOCK TABLES `conversion_conversion` WRITE;
/*!40000 ALTER TABLE `conversion_conversion` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversion_conversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_authapp_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_authapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `authapp_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-04-25 19:36:15.653517','1','Superadmin',1,'[{\"added\": {}}, {\"added\": {\"name\": \"permission\", \"object\": \"Superadmin - dashboard\"}}, {\"added\": {\"name\": \"permission\", \"object\": \"Superadmin - profile\"}}, {\"added\": {\"name\": \"permission\", \"object\": \"Superadmin - user_management\"}}, {\"added\": {\"name\": \"permission\", \"object\": \"Superadmin - role\"}}, {\"added\": {\"name\": \"permission\", \"object\": \"Superadmin - permission\"}}]',7,1),(2,'2025-04-25 19:36:33.308511','1','marketbytesdevops@gmail.com',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',6,1),(3,'2025-04-25 19:36:46.812999','1','marketbytesdevops@gmail.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',6,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(9,'area','area'),(3,'auth','group'),(2,'auth','permission'),(8,'authapp','permission'),(7,'authapp','role'),(6,'authapp','user'),(10,'complaints','complaint'),(14,'connectiontype','connection'),(13,'connectiontype','connectiontype'),(4,'contenttypes','contenttype'),(15,'conversion','conversion'),(5,'sessions','session'),(11,'valves','valve'),(12,'valves','valvelog');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-04-25 19:28:44.166633'),(2,'contenttypes','0002_remove_content_type_name','2025-04-25 19:28:44.244070'),(3,'auth','0001_initial','2025-04-25 19:28:44.554584'),(4,'auth','0002_alter_permission_name_max_length','2025-04-25 19:28:44.627680'),(5,'auth','0003_alter_user_email_max_length','2025-04-25 19:28:44.632953'),(6,'auth','0004_alter_user_username_opts','2025-04-25 19:28:44.639410'),(7,'auth','0005_alter_user_last_login_null','2025-04-25 19:28:44.646041'),(8,'auth','0006_require_contenttypes_0002','2025-04-25 19:28:44.648493'),(9,'auth','0007_alter_validators_add_error_messages','2025-04-25 19:28:44.654836'),(10,'auth','0008_alter_user_username_max_length','2025-04-25 19:28:44.660931'),(11,'auth','0009_alter_user_last_name_max_length','2025-04-25 19:28:44.666582'),(12,'auth','0010_alter_group_name_max_length','2025-04-25 19:28:44.683008'),(13,'auth','0011_update_proxy_permissions','2025-04-25 19:28:44.690719'),(14,'auth','0012_alter_user_first_name_max_length','2025-04-25 19:28:44.696601'),(15,'authapp','0001_initial','2025-04-25 19:28:45.037667'),(16,'admin','0001_initial','2025-04-25 19:28:45.169681'),(17,'admin','0002_logentry_remove_auto_add','2025-04-25 19:28:45.176198'),(18,'admin','0003_logentry_add_action_flag_choices','2025-04-25 19:28:45.184887'),(19,'area','0001_initial','2025-04-25 19:28:45.200357'),(20,'authapp','0002_user_permissions_user_role','2025-04-25 19:28:45.312663'),(21,'authapp','0003_remove_user_permissions_remove_user_role','2025-04-25 19:28:45.365089'),(22,'authapp','0004_role_user_role_permission','2025-04-25 19:28:45.559725'),(23,'authapp','0005_alter_user_username','2025-04-25 19:28:45.627558'),(24,'authapp','0006_alter_user_username','2025-04-25 19:28:45.750780'),(25,'authapp','0007_permission_is_login_page','2025-04-25 19:28:45.781563'),(26,'complaints','0001_initial','2025-04-25 19:28:45.849763'),(27,'complaints','0002_alter_complaint_serial_no_and_more','2025-04-25 19:28:45.882679'),(28,'complaints','0003_complaint_status','2025-04-25 19:28:45.943174'),(29,'complaints','0004_alter_complaint_date','2025-04-25 19:28:45.947532'),(30,'connectiontype','0001_initial','2025-04-25 19:28:46.111438'),(31,'conversion','0001_initial','2025-04-25 19:28:46.262880'),(32,'sessions','0001_initial','2025-04-25 19:28:46.297053'),(33,'valves','0001_initial','2025-04-25 19:28:46.316532'),(34,'valves','0002_valve_latitude_valve_location_link_and_more','2025-04-25 19:28:46.546619'),(35,'valves','0003_remove_valve_location_link','2025-04-25 19:28:46.563772'),(36,'valves','0004_valve_location_link','2025-04-25 19:28:46.583508'),(37,'valves','0005_remove_valve_location_link_and_more','2025-04-25 19:28:46.754833');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('b2r1q25086hrczz0lny0x8owtv166ral','.eJxVjEEOgjAQRe_StWkKLaXj0r1nIDOdGYsaSCisjHdXEha6_e-9_zIDbmsZtirLMLI5m8acfjfC_JBpB3zH6TbbPE_rMpLdFXvQaq8zy_NyuH8HBWv51p5IowoT-qAOuY0paw--l8QJG6ceO-gaCiyaCZLPECFDANeGpCDm_QEWKTi0:1u8Oo9:R2iPSamgebQYf9IHIu572trUAxumgEZ2ytCDp_MlyQk','2025-05-09 19:33:57.977089');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valves_valve`
--

DROP TABLE IF EXISTS `valves_valve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valves_valve` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `full_open_condition` double NOT NULL,
  `current_condition` double NOT NULL,
  `remarks` longtext NOT NULL,
  `previous_position` varchar(100) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `mid_point` double NOT NULL,
  `steepness` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valves_valve`
--

LOCK TABLES `valves_valve` WRITE;
/*!40000 ALTER TABLE `valves_valve` DISABLE KEYS */;
/*!40000 ALTER TABLE `valves_valve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valves_valvelog`
--

DROP TABLE IF EXISTS `valves_valvelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valves_valvelog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `changed_field` varchar(100) NOT NULL,
  `old_value` longtext NOT NULL,
  `new_value` longtext NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `valve_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `valves_valvelog_user_id_6520711d_fk_authapp_user_id` (`user_id`),
  KEY `valves_valvelog_valve_id_3ff9e07d_fk_valves_valve_id` (`valve_id`),
  CONSTRAINT `valves_valvelog_user_id_6520711d_fk_authapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `authapp_user` (`id`),
  CONSTRAINT `valves_valvelog_valve_id_3ff9e07d_fk_valves_valve_id` FOREIGN KEY (`valve_id`) REFERENCES `valves_valve` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valves_valvelog`
--

LOCK TABLES `valves_valvelog` WRITE;
/*!40000 ALTER TABLE `valves_valvelog` DISABLE KEYS */;
/*!40000 ALTER TABLE `valves_valvelog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-26  1:11:16
