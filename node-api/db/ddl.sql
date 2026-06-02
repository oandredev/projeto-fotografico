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
-- Tabela: Clientes
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    name VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    
    phone VARCHAR(20) ,
    email VARCHAR(150) NOT NULL,
    
    birthDate DATE NOT NULL,
    
    isStarred TINYINT(1) DEFAULT 0,
    isArchived TINYINT(1) DEFAULT 0,
    
    register DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Tabela: Detalhes | Sobre
-- -----------------------------------------------------

CREATE TABLE about (
    id INT PRIMARY KEY AUTO_INCREMENT,
    presentationText TEXT NOT NULL,
    imageUrl VARCHAR(500),
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Tabela: hero
-- -----------------------------------------------------
CREATE TABLE hero (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slogan VARCHAR(180) NOT NULL,
    imageUrls JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabela: Categorias para o Portfolio
-- -----------------------------------------------------
CREATE TABLE portfolio_category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE,
    order_index INT NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabela: Portfolio
-- -----------------------------------------------------
CREATE TABLE portfolio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL UNIQUE,
    image_urls JSON NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_portfolio_category
        FOREIGN KEY (category_id)
        REFERENCES portfolio_category(id)
        ON DELETE CASCADE
);