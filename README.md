reset tabelas
usuario e visualização: docker exec -it projeto-emagrecer-db psql -U postgres -d projeto_emagrecer -c "TRUNCATE TABLE usuario, visualizacao RESTART IDENTITY CASCADE;"

videos: docker exec -it projeto-emagrecer-db psql -U postgres -d projeto_emagrecer -c "TRUNCATE TABLE video, visualizacao RESTART IDENTITY CASCADE;"


isso é pra vc acessar
adm
rafael.ifc34@gmail.com
farael12

usuário
rafa@gmail.com
rafael45