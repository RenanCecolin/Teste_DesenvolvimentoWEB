-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS gerenciamento_colaboradores;
USE gerenciamento_colaboradores;

-- Criação da tabela de colaboradores
CREATE TABLE colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    re VARCHAR(20) NOT NULL UNIQUE,
    cargo VARCHAR(100) NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    salario_atual DECIMAL(10,2) NOT NULL,
    salario_anterior DECIMAL(10,2),
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    data_desativacao DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de colaboradores iniciais
INSERT INTO colaboradores 
(nome_completo, re, cargo, empresa, salario_atual, salario_anterior, status)
VALUES
('João Silva', 'RE001', 'Analista de Sistemas', 'Cristália', 4500.00, NULL, 'ATIVO'),
('Maria Oliveira', 'RE002', 'Desenvolvedora Backend', 'Cristália', 3800.00, NULL, 'ATIVO'),
('Carlos Souza', 'RE003', 'Técnico de Suporte', 'Cristália', 1400.00, NULL, 'ATIVO'),
('Ana Pereira', 'RE004', 'Assistente Administrativo', 'Cristália', 1600.00, NULL, 'ATIVO'),
('Lucas Martins', 'RE005', 'Estagiário de TI', 'Cristália', 1200.00, NULL, 'ATIVO');

-- (Listar) SELECT * FROM colaboradores;
-- (Cadastrar) SELECT * FROM colaboradores WHERE re = 'RE999';
select * from colaboradores;