CREATE DATABASE IF NOT EXISTS fotografico_db;
USE fotografico_db;

-- -----------------------------------------------------
-- Tabela: Login
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(400) NOT NULL,
    password VARCHAR(400) NOT NULL
);

INSERT INTO login (email, password) VALUES ('admin@fotografico.com', MD5('123456'));

-- -----------------------------------------------------
-- Tabela: Mensagens
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL, 
    phone VARCHAR(20),          
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(150),       
    body VARCHAR(500) NOT NULL, 
    
    isStarred TINYINT(1) DEFAULT 0, 
    isArchived TINYINT(1) DEFAULT 0,
    
    date DATETIME DEFAULT CURRENT_TIMESTAMP 
); 

-- -----------------------------------------------------
-- Tabela: Mídia
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS midia (
	id INT AUTO_INCREMENT PRIMARY KEY,
    categoria ENUM('newborn', 'gestante', 'familia', 'aniversario', 'parto', 'acompanhamento') NOT NULL,
    tipo ENUM('foto', 'video') DEFAULT 'foto' NOT NULL
);

-- -----------------------------------------------------
-- Tabela: Clientes
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    name VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    
    phone VARCHAR(20),
    email VARCHAR(150) NOT NULL,
    
    birthDate DATE NOT NULL,
    
    isStarred TINYINT(1) DEFAULT 0,
    isArchived TINYINT(1) DEFAULT 0,
    
    register DATETIME DEFAULT CURRENT_TIMESTAMP
);