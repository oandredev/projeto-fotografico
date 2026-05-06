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

-- -----------------------------------------------------
-- Tabela: Mensagens
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS mensagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(150) NOT NULL,
    texto  VARCHAR(600) NOT NULL,
    categoria ENUM('nenhuma', 'arquivado', 'marcado') DEFAULT 'nenhuma',
    data DATETIME DEFAULT CURRENT_TIMESTAMP
);