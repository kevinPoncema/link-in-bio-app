FROM php:8.2-cli

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    zip unzip git curl \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd mbstring xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos de composer primero (para cache)
COPY ./backend/composer*.json ./

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar todo el código del backend
COPY ./backend .

# Configurar permisos para storage y cache
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Crear .env si no existe y generar key
RUN if [ ! -f .env ]; then cp .env.example .env; fi \
    && php artisan key:generate --force

# Exponer puerto de Laravel
EXPOSE 8003

# Comando para iniciar el servidor de Laravel
CMD php artisan serve --host=0.0.0.0 --port=8003
