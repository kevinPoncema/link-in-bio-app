# Usar imagen oficial de PHP 8.2 CLI
FROM php:8.2-cli

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpq-dev \
    sqlite3 \
    libsqlite3-dev \
    npm \
    nodejs \
    netcat-traditional \
    imagemagick \
    libmagickwand-dev \
    webp \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar el directorio del backend
COPY ./backend /var/www/html

# Establecer permisos adecuados
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/storage \
    && chmod -R 777 /var/www/html/bootstrap/cache

# Instalar dependencias de PHP con Composer
RUN composer install --optimize-autoloader --no-dev

# Instalar dependencias de Node.js
RUN npm install

# Construir assets para producción
RUN npm run build

# Script de entrada para configuración inicial y arranque
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting Laravel application..."\n\
\n\
# Esperar a que MySQL esté disponible\n\
if [ "$DB_CONNECTION" = "mysql" ]; then\n\
    echo "⏳ Waiting for MySQL to be ready..."\n\
    until nc -z -v -w30 $DB_HOST $DB_PORT\n\
    do\n\
      echo "Waiting for MySQL connection..."\n\
      sleep 2\n\
    done\n\
    echo "✅ MySQL is ready!"\n\
    \n\
    # Intentar ejecutar migraciones (no fallar si hay error)\n\
    echo "📊 Attempting to run database migrations..."\n\
    php artisan migrate --force || echo "⚠️  Migration failed, continuing anyway..."\n\
fi\n\
\n\
# Configurar directorios de almacenamiento\n\
echo "📁 Setting up storage directories..."\n\
mkdir -p /var/www/html/storage/app/public/profile-pictures\n\
mkdir -p /var/www/html/storage/app/public/images\n\
mkdir -p /var/www/html/storage/app/public/uploads\n\
chmod -R 777 /var/www/html/storage/app/public\n\
\n\
# Crear enlace simbólico para storage\n\
echo "🔗 Creating storage link..."\n\
php artisan storage:link || true\n\
\n\
# Luego limpiar cache (después de que existan las tablas)\n\
echo "🧹 Clearing application cache..."\n\
php artisan config:clear || true\n\
php artisan cache:clear || true\n\
\n\
# Optimizar para producción si está configurado\n\
if [ "$APP_ENV" = "production" ]; then\n\
    echo "⚡ Optimizing for production..."\n\
    php artisan config:cache || true\n\
    php artisan route:cache || true\n\
    php artisan view:cache || true\n\
fi\n\
\n\
echo "✅ Laravel application is ready!"\n\
echo "🌐 Starting server on 0.0.0.0:8000"\n\
\n\
# Iniciar servidor Laravel\n\
exec php artisan serve --host=0.0.0.0 --port=8000' > /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

# Usar el script de entrada personalizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]