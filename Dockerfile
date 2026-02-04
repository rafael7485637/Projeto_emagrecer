FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala somente dependências de produção
RUN npm ci --only=production

# Copia o restante do projeto
COPY . .

# Expõe a porta do app
EXPOSE 3001

# Inicia a aplicação
CMD ["node", "index.js"]
