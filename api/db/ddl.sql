CREATE DATABASE IF NOT EXISTS fotografico_db;
USE fotografico_db;

-- -----------------------------------------------------
-- Tabela: Login
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(400) NOT NULL,
    senha VARCHAR(400) NOT NULL
);