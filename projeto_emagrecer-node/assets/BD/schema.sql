-- Script SQL para criar as tabelas do projeto de emagrecimento

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INTEGER NOT NULL,
  altura DECIMAL(5,2) NOT NULL -- em cm
);

CREATE TABLE IF NOT EXISTS pesos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  peso DECIMAL(5,2) NOT NULL, -- em kg
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);