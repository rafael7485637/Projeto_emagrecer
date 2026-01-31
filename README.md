reset tabelas
usuario e visualização: docker exec -it projeto-emagrecer-db psql -U postgres -d projeto_emagrecer -c "TRUNCATE TABLE usuario, visualizacao RESTART IDENTITY CASCADE;"

videos: docker exec -it projeto-emagrecer-db psql -U postgres -d projeto_emagrecer -c "TRUNCATE TABLE video, visualizacao RESTART IDENTITY CASCADE;"

fazer backup: docker exec projeto-emagrecer-db pg_dump -U postgres projeto_emagrecer > backup_projeto.sql

restaurar backup: (testar)
# 1. Derruba o schema público e cria um novo (limpa tudo)
docker exec -i projeto-emagrecer-db psql -U postgres -d projeto_emagrecer -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Restaura o backup
docker exec -i projeto-emagrecer-db psql -U postgres -d projeto_emagrecer < backup_projeto.sql


isso é pra vc acessar
adm
rafael.ifc34@gmail.com
farael12

usuário
rafa@gmail.com
rafael45