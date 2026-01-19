reset tabelas
TRUNCATE TABLE nome_da_tabela RESTART IDENTITY;

reset tabela referenciada
TRUNCATE TABLE usuario RESTART IDENTITY CASCADE;
