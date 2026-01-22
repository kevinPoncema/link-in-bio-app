FROM node:current

WORKDIR /app

# Copiar package files
COPY ./frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY ./frontend .

# Variables de entorno para Vite
ENV HOST=0.0.0.0
ENV PORT=2999

# Exponer puerto
EXPOSE 2999

# Iniciar Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "2999"]
