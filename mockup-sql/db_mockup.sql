CREATE DATABASE  IF NOT EXISTS `fotografico_db_2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fotografico_db_2`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fotografico_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `about`
--

DROP TABLE IF EXISTS `about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about` (
  `id` int NOT NULL AUTO_INCREMENT,
  `presentationText` text NOT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `lastUpdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about`
--

LOCK TABLES `about` WRITE;
/*!40000 ALTER TABLE `about` DISABLE KEYS */;
INSERT INTO `about` VALUES (1,'Meu nome é Larissa Coutinho de Macedo Calegaro. Sou fotógrafa profissional há 10 anos com formação acadêmica em Publicidade e Propaganda. Sempre gostei de interagir com crianças e ajudar minha família. Agora ganho a vida para marcar os momentos mais importantes de outras famílias, em especial os momentos com suas crianças.\r\n\r\nNeste meu serviço entrego a melhor experiência possível para meus clientes. Quero que minhas fotos e vídeos sejam símbolos de maravilhosos momentos que vocês tenham. Venham com a gente!','/uploads/about/about-1780873331109-cs83q.png','2026-06-07 23:02:11');
/*!40000 ALTER TABLE `about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `birthDate` date NOT NULL,
  `isStarred` tinyint(1) DEFAULT '0',
  `isArchived` tinyint(1) DEFAULT '0',
  `register` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_archived` tinyint(1) DEFAULT '0',
  `is_starred` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Ana Souza','038.084.200-90','(11) 98765-4321','ana@email.com','1995-03-12',0,0,'2026-06-07 09:10:00',0,0),(2,'Carlos Lima','736.119.270-07','(11) 98123-4567','carlos@email.com','1988-07-22',0,0,'2026-06-07 11:30:00',0,0),(3,'Mariana Alves','216.722.420-61','(11) 99987-7766','mariana@email.com','1992-11-05',0,1,'2026-06-03 09:40:00',0,0),(4,'João Pedro','005.636.610-89','(11) 99555-3322','joao@email.com','1985-01-30',1,1,'2026-06-04 13:10:00',0,0),(5,'Fernanda Rocha','250.138.750-30','(11) 99444-2211','fernanda@email.com','1990-06-18',1,0,'2026-06-05 08:30:00',0,0),(6,'Lucas Martins','218.589.050-60','(11) 99333-1122','lucas@email.com','2000-09-10',0,0,'2026-06-06 14:55:00',0,0),(7,'Beatriz Costa','563.619.020-48','(11) 99222-3344','bia@email.com','1997-12-01',0,0,'2026-06-01 10:05:00',0,0),(8,'Rafael Dias','535.601.260-88','(11) 99111-2233','rafael@mail.com','1983-04-14',0,0,'2026-06-02 15:20:00',0,0),(9,'Juliana Mendes','901.234.567-89','(11) 99000-1122','juliana@email.com','1993-08-09',0,0,'2026-06-02 09:00:00',0,0),(10,'Thiago Pereira','012.345.678-90','(11) 98887-7777','thiago@email.com','1991-02-27',0,0,'2026-06-03 12:45:00',0,0),(11,'Camila Ferreira','540.596.180-98','(11) 98776-6655','camila@email.com','1994-05-16',0,1,'2026-06-04 16:10:00',0,0),(12,'Bruno Almeida','860.251.950-80','(11) 98665-5444','bruno@email.com','1987-10-02',0,1,'2026-06-05 09:25:00',0,0),(13,'Patrícia Gomes','198.880.960-60','(11) 98555-4433','patricia@email.com','1996-03-21',0,0,'2026-05-20 11:00:00',0,0),(14,'Eduardo Ramos','779.307.080-12','(11) 98444-3322','eduardo@email.com','1989-12-12',0,0,'2026-05-18 13:40:00',0,0),(15,'Larissa Nunes','490.623.800-93','(11) 98333-2211','larissa@email.com','1998-07-07',1,0,'2026-05-10 10:15:00',0,0),(16,'Felipe Santos','944.854.260-76','(11) 98221-1000','felipe@email.com','1990-01-01',1,0,'2026-04-25 12:30:00',0,0),(17,'Gustavo Lima','714.543.610-85','(11) 98000-9988','gustavo@email.com','1986-06-06',0,0,'2026-04-10 09:10:00',0,0),(18,'Isabela Monteiro','026.429.970-14','(11) 97999-8877','isabela@email.com','1995-10-10',1,0,'2026-03-25 11:35:00',0,0),(19,'Renato Silva','226.041.970-49','(11) 97888-7766','renato@email.com','1982-11-11',1,1,'2026-03-10 15:50:00',0,0),(20,'Sofia Martins','998.275.080-16','(11) 97777-6655','sofia@email.com','1997-04-04',1,0,'2026-02-28 10:00:00',0,0),(21,'Pedro Henrique','419.189.770-54','(11) 97666-5544','pedro@email.com','1991-05-05',1,1,'2026-02-15 11:20:00',0,0),(22,'Gabriela Souza de Lima','009.790.490-24','(11) 97555-1234','gabriela.slima@email.com','1993-06-07',1,0,'2026-01-30 12:40:00',0,0);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slogan` varchar(180) NOT NULL,
  `imageUrls` json NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero`
--

LOCK TABLES `hero` WRITE;
/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
INSERT INTO `hero` VALUES (1,'Fotografando famílias com\r\nregistros que duram pra sempre','[\"/uploads/hero/hero-1780873323551-ralmx.png\", \"/uploads/hero/hero-1780873323554-1ol95.png\", \"/uploads/hero/hero-1780873323558-n4fh2.png\", \"/uploads/hero/hero-1780873323561-ufgwr.png\", \"/uploads/hero/hero-1780873323564-jcja4.png\", \"/uploads/hero/hero-1780873323569-nrdvj.png\", \"/uploads/hero/hero-1780873323571-aexh4.png\", \"/uploads/hero/hero-1780873323576-44s0o.png\", \"/uploads/hero/hero-1780873323578-i4gph.png\", \"/uploads/hero/hero-1780873323581-ghv21.png\", \"/uploads/hero/hero-1780873323584-82od1.png\"]','2026-05-23 22:12:41','2026-06-09 18:54:31');
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'admin@fotografico.com','e10adc3949ba59abbe56e057f20f883e');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `body` varchar(500) NOT NULL,
  `isStarred` tinyint(1) DEFAULT '0',
  `isArchived` tinyint(1) DEFAULT '0',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_archived` tinyint(1) DEFAULT '0',
  `is_starred` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'Ana Souza','(11) 98765-4321','ana@email.com','Ensaio gestante','Olá, gostaria de orçamento para ensaio gestante ao ar livre. Estou no 7º mês.',1,0,'2026-06-01 10:15:00',0,0),(2,'Carlos Lima','(11) 98123-4567','carlos@email.com','Aniversário infantil','Preciso de fotos para aniversário de 1 ano do meu filho. Vocês fazem cobertura completa?',0,0,'2026-06-02 14:22:00',0,0),(3,'Mariana Alves','(11) 99987-7766','mariana@email.com','Newborn','Gostaria de orçamento para ensaio recém-nascido nos primeiros dias de vida.',1,1,'2026-06-03 09:40:00',0,0),(4,'João Pedro','(11) 99555-3322','joao@email.com','Fotos família','Queria um ensaio fotográfico em família, algo mais natural em parque.',0,0,'2026-06-03 11:10:00',0,0),(5,'Fernanda Rocha','(11) 99444-2211','fernanda@email.com','Acompanhamento bebê','Vocês fazem plano de acompanhamento mensal do bebê?',1,1,'2026-06-04 08:30:00',0,0),(6,'Lucas Martins','(11) 99333-1122','lucas@email.com','Aniversário 2 anos','Gostaria de orçamento para festa de 2 anos em buffet infantil.',0,0,'2026-06-04 13:55:00',0,0),(7,'Beatriz Costa','(11) 99222-3344','bia@email.com','Ensaio gestante estúdio','Vocês fazem ensaio gestante em estúdio com figurino?',0,0,'2026-06-05 10:05:00',0,0),(8,'Rafael Dias','(11) 99111-2233','rafael@email.com','Fotos família externa','Preciso de fotos de família em ambiente externo, parque ou praia.',0,0,'2026-06-05 15:20:00',0,0),(9,'Juliana Mendes','(11) 99000-1122','juliana@email.com','Newborn em casa','Vocês fazem ensaio newborn no domicílio?',1,0,'2026-06-06 09:00:00',0,0),(10,'Thiago Pereira','(11) 98887-7777','thiago@email.com','Aniversário 5 anos','Quanto custa cobertura de festa de 5 anos com fotos digitais?',0,0,'2026-06-06 12:45:00',0,0),(11,'Camila Ferreira','(11) 98776-6655','camila@email.com','Gestante externa','Quero orçamento para ensaio gestante em campo aberto.',1,0,'2026-06-06 16:10:00',0,0),(12,'Bruno Almeida','(11) 98665-5444','bruno@email.com','Família completa','Gostaria de fotos da família inteira, incluindo avós.',0,0,'2026-06-07 09:25:00',0,0),(13,'Patrícia Gomes','(11) 98555-4433','patricia@email.com','Acompanhamento bebê mensal','Vocês oferecem pacote mensal para acompanhar crescimento do bebê?',1,0,'2026-06-07 11:00:00',0,0),(14,'Eduardo Ramos','(11) 98444-3322','eduardo@email.com','Aniversário 10 anos','Preciso de fotógrafo para festa de 10 anos em salão.',0,0,'2026-06-07 13:40:00',0,0),(15,'Larissa Nunes','(11) 98333-2211','larissa@email.com','Ensaio gestante praia','Queria um ensaio gestante na praia ao pôr do sol.',0,0,'2026-06-08 10:15:00',0,0),(16,'Felipe Santos','(11) 98221-1000','felipe@email.com','Newborn estúdio premium','Qual valor para ensaio newborn completo com cenário?',1,0,'2026-06-08 12:30:00',0,0),(17,'Julia Vieira','(11) 98111-0099','julia@email.com','Aniversário infantil simples','Preciso de fotos de festa infantil simples em casa.',0,0,'2026-06-08 14:45:00',0,0),(18,'Gustavo Lima','(11) 98000-9988','gustavo@email.com','Família estúdio','Vocês fazem fotos de família em estúdio neutro?',1,0,'2026-06-09 09:10:00',0,0),(19,'Isabela Monteiro','(11) 97999-8877','isabela@email.com','Acompanhamento crescimento','Gostaria de pacote para fotos trimestrais do meu filho.',1,0,'2026-06-09 11:35:00',0,0),(20,'Renato Silva','(11) 97888-7766','renato@email.com','Aniversário grande','Evento de aniversário infantil com mais de 100 convidados, cobertura completa?',1,1,'2026-06-09 15:50:00',0,0);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `image_urls` json NOT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_id` (`category_id`),
  CONSTRAINT `fk_portfolio_category` FOREIGN KEY (`category_id`) REFERENCES `portfolio_category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio`
--

LOCK TABLES `portfolio` WRITE;
/*!40000 ALTER TABLE `portfolio` DISABLE KEYS */;
INSERT INTO `portfolio` VALUES (1,1,'[\"/uploads/portfolio/portfolio-1780871393426-ldulz.png\", \"/uploads/portfolio/portfolio-1780871393417-x7flw.png\", \"/uploads/portfolio/portfolio-1780871393422-55jmv.png\"]','2026-06-07 22:30:01'),(2,2,'[\"/uploads/portfolio/portfolio-1780871432281-ofpzq.png\", \"/uploads/portfolio/portfolio-1780871432285-wcqxw.png\", \"/uploads/portfolio/portfolio-1780871432288-5g1wv.png\", \"/uploads/portfolio/portfolio-1780871432291-4rg46.png\", \"/uploads/portfolio/portfolio-1780873228715-fti4g.png\", \"/uploads/portfolio/portfolio-1780871432292-thuaa.png\", \"/uploads/portfolio/portfolio-1780873228726-7l3k3.png\"]','2026-06-08 20:03:57'),(3,3,'[\"/uploads/portfolio/portfolio-1780871545130-97ua7.png\", \"/uploads/portfolio/portfolio-1780871545125-4si0p.png\", \"/uploads/portfolio/portfolio-1780871545133-lditf.png\", \"/uploads/portfolio/portfolio-1780871545135-vqwqv.png\"]','2026-06-09 18:58:15'),(4,4,'[\"/uploads/portfolio/portfolio-1780873105780-wbqgr.png\", \"/uploads/portfolio/portfolio-1780873105784-oj6w6.png\", \"/uploads/portfolio/portfolio-1780873105788-8njjh.png\", \"/uploads/portfolio/portfolio-1780873105808-xxl0w.png\"]','2026-06-08 20:04:13'),(5,5,'[\"/uploads/portfolio/portfolio-1780873190110-0vmf5.png\", \"/uploads/portfolio/portfolio-1780949069162-mh15d.png\", \"/uploads/portfolio/portfolio-1780949069180-5xf4c.png\"]','2026-06-08 20:04:29'),(6,6,'[\"/uploads/portfolio/portfolio-1780873177796-qbshw.png\", \"/uploads/portfolio/portfolio-1781035780778-9vxof.png\", \"/uploads/portfolio/portfolio-1781035780785-3l57a.png\", \"/uploads/portfolio/portfolio-1781035780788-f2yn3.png\"]','2026-06-09 20:09:40');
/*!40000 ALTER TABLE `portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_category`
--

DROP TABLE IF EXISTS `portfolio_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `order_index` int NOT NULL,
  `views` int DEFAULT '0',
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_category`
--

LOCK TABLES `portfolio_category` WRITE;
/*!40000 ALTER TABLE `portfolio_category` DISABLE KEYS */;
INSERT INTO `portfolio_category` VALUES (1,'Aniversário',1,14,'2026-06-09 20:09:54'),(2,'Família',2,16,'2026-06-09 19:26:21'),(3,'Gestante',3,9,'2026-06-09 20:09:54'),(4,'Recém-Nascido',4,13,'2026-06-09 20:10:10'),(5,'Acompanhamento',6,16,'2026-06-09 20:10:10'),(6,'Parto',5,8,'2026-06-09 20:09:54');
/*!40000 ALTER TABLE `portfolio_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-09 17:13:37
