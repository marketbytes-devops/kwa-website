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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_area`
--

LOCK TABLES `area_area` WRITE;
/*!40000 ALTER TABLE `area_area` DISABLE KEYS */;
INSERT INTO `area_area` VALUES (1,'PLM'),(2,'VAZ');
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_user'),(22,'Can change user',6,'change_user'),(23,'Can delete user',6,'delete_user'),(24,'Can view user',6,'view_user'),(25,'Can add home banner',7,'add_homebanner'),(26,'Can change home banner',7,'change_homebanner'),(27,'Can delete home banner',7,'delete_homebanner'),(28,'Can view home banner',7,'view_homebanner'),(29,'Can add services',8,'add_services'),(30,'Can change services',8,'change_services'),(31,'Can delete services',8,'delete_services'),(32,'Can view services',8,'view_services'),(33,'Can add area',9,'add_area'),(34,'Can change area',9,'change_area'),(35,'Can delete area',9,'delete_area'),(36,'Can view area',9,'view_area'),(37,'Can add complaint',10,'add_complaint'),(38,'Can change complaint',10,'change_complaint'),(39,'Can delete complaint',10,'delete_complaint'),(40,'Can view complaint',10,'view_complaint'),(41,'Can add valve',11,'add_valve'),(42,'Can change valve',11,'change_valve'),(43,'Can delete valve',11,'delete_valve'),(44,'Can view valve',11,'view_valve'),(45,'Can add valve log',12,'add_valvelog'),(46,'Can change valve log',12,'change_valvelog'),(47,'Can delete valve log',12,'delete_valvelog'),(48,'Can view valve log',12,'view_valvelog'),(49,'Can add permission',13,'add_permission'),(50,'Can change permission',13,'change_permission'),(51,'Can delete permission',13,'delete_permission'),(52,'Can view permission',13,'view_permission'),(53,'Can add role',14,'add_role'),(54,'Can change role',14,'change_role'),(55,'Can delete role',14,'delete_role'),(56,'Can view role',14,'view_role');
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_permission`
--

LOCK TABLES `authapp_permission` WRITE;
/*!40000 ALTER TABLE `authapp_permission` DISABLE KEYS */;
INSERT INTO `authapp_permission` VALUES (2,'dashboard',1,1,1,1,2,1),(3,'complaints',1,1,1,1,2,0),(4,'bluebrigade',1,1,1,1,2,0),(5,'runningcontract',1,1,1,1,2,0),(6,'valves',1,1,1,1,2,0),(7,'area',1,1,1,1,2,0),(8,'flows',1,1,1,1,2,0),(9,'profile',1,1,1,1,2,0),(10,'user_management',1,1,1,1,2,0),(11,'bluebrigade',1,1,1,1,3,0),(13,'runningcontract',1,1,1,1,4,0),(14,'profile',1,1,1,1,4,0),(15,'valves',1,1,1,1,5,0),(16,'profile',1,1,1,1,5,0),(17,'complaints',1,1,1,1,6,0),(18,'valves',1,1,1,1,6,0),(19,'profile',1,1,1,1,6,0),(28,'profile',1,1,1,1,3,0),(29,'role',1,1,1,1,2,0),(31,'permission',1,1,1,1,2,0),(32,'complaints',1,1,1,1,9,1),(33,'valves',1,1,1,1,9,0),(34,'profile',1,1,1,1,9,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_role`
--

LOCK TABLES `authapp_role` WRITE;
/*!40000 ALTER TABLE `authapp_role` DISABLE KEYS */;
INSERT INTO `authapp_role` VALUES (2,'Superadmin','Full access to all features'),(3,'Bluebrigade','Access to Bluebrigade and Profile'),(4,'Running Contract','Access to Running Contract and Profile'),(5,'Fitter','Access to Valves and Profile'),(6,'Manager','Access to Complaints, Valves (view only), and Profile'),(8,'Employee','View only'),(9,'Admin','Can handle complaints and value');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authapp_user`
--

LOCK TABLES `authapp_user` WRITE;
/*!40000 ALTER TABLE `authapp_user` DISABLE KEYS */;
INSERT INTO `authapp_user` VALUES (14,'pbkdf2_sha256$870000$th3yawf5BSkZP5aO44PPm8$deF8Yd+CnHuSpjYFn1w4kO5ZqIo/G911aN9eZJe+lVw=','2025-04-16 14:17:08.000000',1,'Marketbytes','Devops',1,1,'2025-04-16 14:16:20.000000','marketbytesdevops@gmail.com','','kwa-superadmin',2);
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints_complaint`
--

LOCK TABLES `complaints_complaint` WRITE;
/*!40000 ALTER TABLE `complaints_complaint` DISABLE KEYS */;
INSERT INTO `complaints_complaint` VALUES (14,'001','consumer','PLM001','akshay','2025-04-14','hhvjfdjbfjdsbnjkvn','9947384437','bluebrigade',1,'accepted'),(15,'002','consumer','VAZ001','anagha','2025-04-07','dxc bnfghjdxdfvc','9947384437','runningcontract',2,'processing'),(16,'003','general','PLM002','jency','2025-04-08','bdkjaadsfnvsjndjvnz','9947384437','runningcontract',1,'processing'),(17,'004','consumer','VAZ002','meera','2025-04-21','djsfcjdbvbfsvcnv vnvcv','9947384437','runningcontract',2,'processing'),(18,'005','general','PLM003','wertyuiop','2025-04-10','wertyuiop','9947384437','runningcontract',1,'processing'),(19,'006','consumer','PLM004','Ajay Renjith','2025-04-17','First Floor, A-Wing, Chaithanya Building Infopark, Office No.A1-15, Cherthala, Kerala','09633175758','runningcontract',1,'accepted');
/*!40000 ALTER TABLE `complaints_complaint` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (46,'2025-04-16 14:17:22.480168','8','ajayrenjith03@gmail.com',3,'',6,14),(47,'2025-04-16 14:17:22.480201','10','ajayrenjith08@gmail.com',3,'',6,14),(48,'2025-04-16 14:17:22.480213','11','akshay07marketbyteswebworks@gmail.com',3,'',6,14),(49,'2025-04-16 14:17:22.480222','13','anaghaajayaghosh@gmail.com',3,'',6,14),(50,'2025-04-16 14:18:06.940747','14','marketbytesdevops@gmail.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\", \"Role\"]}}]',6,14);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(9,'area','area'),(3,'auth','group'),(2,'auth','permission'),(13,'authapp','permission'),(14,'authapp','role'),(6,'authapp','user'),(10,'complaints','complaint'),(4,'contenttypes','contenttype'),(7,'home','homebanner'),(8,'services','services'),(5,'sessions','session'),(11,'valves','valve'),(12,'valves','valvelog');
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-04-02 05:16:31.111675'),(2,'contenttypes','0002_remove_content_type_name','2025-04-02 05:16:31.181223'),(3,'auth','0001_initial','2025-04-02 05:16:31.494413'),(4,'auth','0002_alter_permission_name_max_length','2025-04-02 05:16:31.580284'),(5,'auth','0003_alter_user_email_max_length','2025-04-02 05:16:31.588281'),(6,'auth','0004_alter_user_username_opts','2025-04-02 05:16:31.596205'),(7,'auth','0005_alter_user_last_login_null','2025-04-02 05:16:31.604284'),(8,'auth','0006_require_contenttypes_0002','2025-04-02 05:16:31.608239'),(9,'auth','0007_alter_validators_add_error_messages','2025-04-02 05:16:31.616635'),(10,'auth','0008_alter_user_username_max_length','2025-04-02 05:16:31.626271'),(11,'auth','0009_alter_user_last_name_max_length','2025-04-02 05:16:31.636274'),(12,'auth','0010_alter_group_name_max_length','2025-04-02 05:16:31.658506'),(13,'auth','0011_update_proxy_permissions','2025-04-02 05:16:31.665381'),(14,'auth','0012_alter_user_first_name_max_length','2025-04-02 05:16:31.677110'),(15,'authapp','0001_initial','2025-04-02 05:16:32.062008'),(16,'admin','0001_initial','2025-04-02 05:16:32.243137'),(17,'admin','0002_logentry_remove_auto_add','2025-04-02 05:16:32.251582'),(18,'admin','0003_logentry_add_action_flag_choices','2025-04-02 05:16:32.262495'),(19,'home','0001_initial','2025-04-02 05:16:32.285058'),(20,'home','0002_alter_homebanner_title','2025-04-02 05:16:32.299087'),(21,'services','0001_initial','2025-04-02 05:16:32.324093'),(22,'services','0002_rename_servicecard_services','2025-04-02 05:16:32.356585'),(23,'services','0003_alter_services_link','2025-04-02 05:16:32.373084'),(24,'sessions','0001_initial','2025-04-02 05:16:32.421551'),(25,'area','0001_initial','2025-04-02 10:33:34.736159'),(26,'complaints','0001_initial','2025-04-02 10:54:31.835816'),(27,'complaints','0002_alter_complaint_serial_no_and_more','2025-04-03 10:33:14.461887'),(28,'complaints','0003_complaint_status','2025-04-03 10:44:30.372038'),(29,'valves','0001_initial','2025-04-07 10:13:19.971550'),(30,'valves','0002_rename_position_valve_previous_position','2025-04-08 09:29:34.648302'),(31,'valves','0003_valve_percentage','2025-04-08 09:39:51.344999'),(32,'valves','0004_valve_location_valvelog','2025-04-08 10:16:19.981600'),(33,'valves','0005_valvelog_message','2025-04-08 11:32:32.124566'),(34,'valves','0006_rename_previous_position_valve_position_and_more','2025-04-08 11:54:10.646287'),(35,'valves','0007_remove_valve_position','2025-04-08 12:09:47.445714'),(36,'valves','0008_rename_current_condition_valve_current_position','2025-04-08 12:21:36.657337'),(37,'valves','0009_valve_previous_position','2025-04-08 12:38:17.592208'),(38,'valves','0010_rename_current_position_valve_current_condition_and_more','2025-04-09 06:19:49.282675'),(39,'valves','0011_remove_valve_percentage','2025-04-10 07:37:43.933477'),(40,'valves','0012_remove_valve_location_valve_latitude_and_more','2025-04-10 07:55:39.505461'),(41,'valves','0002_valve_latitude_valve_location_link_and_more','2025-04-10 10:20:36.532530'),(42,'valves','0003_remove_valve_location_link','2025-04-10 11:11:12.798409'),(43,'valves','0004_valve_location_link','2025-04-10 11:11:53.655482'),(44,'authapp','0002_user_permissions_user_role','2025-04-11 09:46:37.071945'),(45,'authapp','0003_remove_user_permissions_remove_user_role','2025-04-11 10:03:13.454215'),(46,'authapp','0004_role_user_role_permission','2025-04-11 10:18:13.859961'),(47,'authapp','0005_alter_user_username','2025-04-15 09:42:42.747955'),(48,'authapp','0006_alter_user_username','2025-04-15 10:15:39.407573'),(49,'authapp','0007_permission_is_login_page','2025-04-16 05:26:01.249756');
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
INSERT INTO `django_session` VALUES ('l7c45316gtqbgv0baqfa5t9z2pefg189','.eJxVjDsOwjAQRO_iGlnr-JdQ0ucM1np3jQMokfKpEHcnkVJAN5r3Zt4q4bbWtC0yp4HVVRmnLr9lRnrKeBB-4HifNE3jOg9ZH4o-6aL7ieV1O92_g4pL3dexsIAQSYMs1HUQIIZsnfVRXCfBBe8hOt6DhULABkLB1jaRTG7aoj5fFeY32w:1u53Zc:Jh2pi3Rzio2SQp8FDipTKNn8Gp3cFmj0HrQtIJeZWqU','2025-04-30 14:17:08.708164'),('tjj0c34265w2jm0hv4hyssxh2ezooz44','.eJxVjMEKwyAQRP_FcxE1KrHH3vsNsu6uNW1RiMkp9N-bQA7taWDem9lEhHUpce08x4nEVYzi8tslwBfXA9AT6qNJbHWZpyQPRZ60y3sjft9O9--gQC_72lu0jsg7tMwIgxt1VmowQ0azR4KggZNFxZQSBmWsdyFQtoxIqLT4fAH3PTiq:1u4hbC:PFfL6TJBYUzTm04wcgpItq3tmMMOtFKqRN7w4Fu9RHs','2025-04-29 14:49:18.432974'),('xgmciuufsn3t1lecvx6dlmqhaejqer1k','.eJxVjMEKwyAQRP_FcxE1KrHH3vsNsu6uNW1RiMkp9N-bQA7taWDem9lEhHUpce08x4nEVYzi8tslwBfXA9AT6qNJbHWZpyQPRZ60y3sjft9O9--gQC_72lu0jsg7tMwIgxt1VmowQ0azR4KggZNFxZQSBmWsdyFQtoxIqLT4fAH3PTiq:1u4fHa:D9Z7Ct9N3Ba-mNNGcDlXEtpBBZ9vVEc1jV9tkcgvqcg','2025-04-29 12:20:54.938639');
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
  `full_open_condition` varchar(100) NOT NULL,
  `current_condition` varchar(100) NOT NULL,
  `remarks` longtext NOT NULL,
  `previous_position` varchar(100) NOT NULL,
  `latitude` double DEFAULT NULL,
  `location_type` varchar(20) NOT NULL,
  `longitude` double DEFAULT NULL,
  `location_link` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valves_valve`
--

LOCK TABLES `valves_valve` WRITE;
/*!40000 ALTER TABLE `valves_valve` DISABLE KEYS */;
INSERT INTO `valves_valve` VALUES (7,'jency','34','open','20','closed','50',NULL,'coordinates',NULL,NULL),(8,'akshay','34','opened','60','full width','25',NULL,'coordinates',NULL,NULL),(9,'Test','30','30','40','Half Opened','50',NULL,'current',NULL,'https://www.google.com/maps?q=9.5715328,76.316672'),(10,'aksh','32','20','40','full opned','50',76.96848,'coordinates',8.499653,NULL),(11,'ajayaghosh','34','30','50','half opened','20',8.499653,'coordinates',76.96848,NULL),(12,'jency','45','30','30','opned','45',26.9124,'coordinates',75.7858,NULL),(13,'silvia','34','25','60','fulled closed','50',9.7322707,'coordinates',76.3535452,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valves_valvelog`
--

LOCK TABLES `valves_valvelog` WRITE;
/*!40000 ALTER TABLE `valves_valvelog` DISABLE KEYS */;
INSERT INTO `valves_valvelog` VALUES (1,'current_condition','half opened','full','2025-04-09 06:20:58.017100',NULL,8),(2,'current_condition','open','30','2025-04-09 07:06:08.488980',NULL,7),(3,'previous_position','close','40','2025-04-09 07:15:19.854931',NULL,7),(4,'current_condition','full','60','2025-04-09 07:23:38.680408',NULL,8),(5,'previous_position','full closed','15','2025-04-09 07:23:38.690068',NULL,8),(6,'remarks','close','open','2025-04-09 08:56:54.805346',NULL,7),(7,'previous_position','40','70','2025-04-09 08:58:06.784906',NULL,7),(8,'current_condition','30','10','2025-04-09 09:30:38.573565',NULL,7),(9,'previous_position','70','50','2025-04-09 09:34:32.484194',NULL,7),(10,'current_condition','10','20','2025-04-09 09:44:47.891188',NULL,7),(11,'previous_position','15','25','2025-04-09 09:45:17.627711',NULL,8),(12,'remarks','open','closed','2025-04-09 10:13:50.087166',NULL,7);
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

-- Dump completed on 2025-04-16 20:08:25
