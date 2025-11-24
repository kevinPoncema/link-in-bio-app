# Build stage - Etapa de construcción
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY ./frontend/package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar todo el código fuente del frontend
COPY ./frontend .

# Construir la aplicación para producción
RUN npm run build

# Production stage - Etapa de producción con Nginx
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Crear configuración personalizada de Nginx para SPA React
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Configuración para Single Page Application
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
}
EOF

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage - Etapa de desarrollo (opcional)
FROM node:18-alpine AS development

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY ./frontend/package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar todo el código fuente del frontend
COPY ./frontend .

# Exponer puerto para desarrollo (Vite)
EXPOSE 5173

# Configurar Vite para aceptar conexiones externas
ENV HOST=0.0.0.0
ENV PORT=5173

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]