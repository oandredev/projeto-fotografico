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

-- -----------------------------------------------------
-- MOCKS
-- -----------------------------------------------------
INSERT INTO message (
    name, phone, email,
    subject, body,
    isStarred, isArchived,
    date
) VALUES

('Ana Souza', '(11) 98765-4321', 'ana@email.com', 'Ensaio gestante', 'Olá, gostaria de orçamento para ensaio gestante ao ar livre. Estou no 7º mês.', 1, 0, '2026-06-01 10:15:00'),

('Carlos Lima', '(11) 98123-4567', 'carlos@email.com', 'Aniversário infantil', 'Preciso de fotos para aniversário de 1 ano do meu filho. Vocês fazem cobertura completa?', 0, 0, '2026-06-02 14:22:00'),

('Mariana Alves', '(11) 99987-7766', 'mariana@email.com', 'Newborn', 'Gostaria de orçamento para ensaio recém-nascido nos primeiros dias de vida.', 1, 0, '2026-06-03 09:40:00'),

('João Pedro', '(11) 99555-3322', 'joao@email.com', 'Fotos família', 'Queria um ensaio fotográfico em família, algo mais natural em parque.', 0, 0, '2026-06-03 11:10:00'),

('Fernanda Rocha', '(11) 99444-2211', 'fernanda@email.com', 'Acompanhamento bebê', 'Vocês fazem plano de acompanhamento mensal do bebê?', 1, 0, '2026-06-04 08:30:00'),

('Lucas Martins', '(11) 99333-1122', 'lucas@email.com', 'Aniversário 2 anos', 'Gostaria de orçamento para festa de 2 anos em buffet infantil.', 0, 0, '2026-06-04 13:55:00'),

('Beatriz Costa', '(11) 99222-3344', 'bia@email.com', 'Ensaio gestante estúdio', 'Vocês fazem ensaio gestante em estúdio com figurino?', 0, 0, '2026-06-05 10:05:00'),

('Rafael Dias', '(11) 99111-2233', 'rafael@email.com', 'Fotos família externa', 'Preciso de fotos de família em ambiente externo, parque ou praia.', 0, 0, '2026-06-05 15:20:00'),

('Juliana Mendes', '(11) 99000-1122', 'juliana@email.com', 'Newborn em casa', 'Vocês fazem ensaio newborn no domicílio?', 1, 0, '2026-06-06 09:00:00'),

('Thiago Pereira', '(11) 98887-7777', 'thiago@email.com', 'Aniversário 5 anos', 'Quanto custa cobertura de festa de 5 anos com fotos digitais?', 0, 0, '2026-06-06 12:45:00'),

('Camila Ferreira', '(11) 98776-6655', 'camila@email.com', 'Gestante externa', 'Quero orçamento para ensaio gestante em campo aberto.', 1, 0, '2026-06-06 16:10:00'),

('Bruno Almeida', '(11) 98665-5444', 'bruno@email.com', 'Família completa', 'Gostaria de fotos da família inteira, incluindo avós.', 0, 0, '2026-06-07 09:25:00'),

('Patrícia Gomes', '(11) 98555-4433', 'patricia@email.com', 'Acompanhamento bebê mensal', 'Vocês oferecem pacote mensal para acompanhar crescimento do bebê?', 1, 0, '2026-06-07 11:00:00'),

('Eduardo Ramos', '(11) 98444-3322', 'eduardo@email.com', 'Aniversário 10 anos', 'Preciso de fotógrafo para festa de 10 anos em salão.', 0, 0, '2026-06-07 13:40:00'),

('Larissa Nunes', '(11) 98333-2211', 'larissa@email.com', 'Ensaio gestante praia', 'Queria um ensaio gestante na praia ao pôr do sol.', 0, 0, '2026-06-08 10:15:00'),

('Felipe Santos', '(11) 98221-1000', 'felipe@email.com', 'Newborn estúdio premium', 'Qual valor para ensaio newborn completo com cenário?', 1, 0, '2026-06-08 12:30:00'),

('Julia Vieira', '(11) 98111-0099', 'julia@email.com', 'Aniversário infantil simples', 'Preciso de fotos de festa infantil simples em casa.', 0, 0, '2026-06-08 14:45:00'),

('Gustavo Lima', '(11) 98000-9988', 'gustavo@email.com', 'Família estúdio', 'Vocês fazem fotos de família em estúdio neutro?', 0, 0, '2026-06-09 09:10:00'),

('Isabela Monteiro', '(11) 97999-8877', 'isabela@email.com', 'Acompanhamento crescimento', 'Gostaria de pacote para fotos trimestrais do meu filho.', 1, 0, '2026-06-09 11:35:00'),

('Renato Silva', '(11) 97888-7766', 'renato@email.com', 'Aniversário grande', 'Evento de aniversário infantil com mais de 100 convidados, cobertura completa?', 0, 0, '2026-06-09 15:50:00');

SELECT
    SUM(CASE WHEN DATE(date) = '2026-06-07' THEN 1 ELSE 0 END) AS today_total,

    SUM(CASE WHEN DATE(date) BETWEEN '2026-06-01' AND '2026-06-07' THEN 1 ELSE 0 END) AS week_total,

    SUM(CASE WHEN YEAR(date) = 2026 AND MONTH(date) = 6 THEN 1 ELSE 0 END) AS month_total,

    SUM(CASE WHEN YEAR(date) = 2026 THEN 1 ELSE 0 END) AS year_total
FROM message;