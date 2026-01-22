# Usar Node.js 18 Alpine para un contenedor ligero
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY ./frontend/package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar todo el código fuente del frontend
COPY ./frontend .

# Configurar Vite para aceptar conexiones externas
# HOST=0.0.0.0 permite conexiones desde cualquier IP (necesario para Docker)
# PORT=5173 es el puerto predeterminado de Vite
ENV HOST=0.0.0.0
ENV PORT=5173

# Exponer el puerto de Vite
EXPOSE 5173

# Health check para verificar que Vite está corriendo
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Comando por defecto para iniciar Vite en modo desarrollo
# Con --host para escuchar en todas las interfaces de red
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]