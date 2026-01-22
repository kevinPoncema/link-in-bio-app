#!/bin/bash

# Script de despliegue para Link-in-Bio App
# Uso: ./deploy.sh [start|stop|restart|logs|clean]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Link-in-Bio App - Docker Deploy     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
    echo -e "${YELLOW}Copiando .env.example a .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado. Por favor, edita las variables si es necesario.${NC}"
fi

# Función para iniciar los contenedores
start() {
    echo -e "${YELLOW}🚀 Construyendo e iniciando contenedores...${NC}"
    docker compose up -d --build
    
    echo -e "${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}"
    sleep 10
    
    echo -e "${YELLOW}📊 Estado de los contenedores:${NC}"
    docker compose ps
    
    echo -e "\n${YELLOW}🔧 Ejecutando migraciones...${NC}"
    docker compose exec backend php artisan migrate --force || echo -e "${RED}⚠️  Error al ejecutar migraciones. Intenta manualmente: docker compose exec backend php artisan migrate${NC}"
    
    echo -e "\n${YELLOW}🔗 Creando enlace de storage...${NC}"
    docker compose exec backend php artisan storage:link || echo -e "${YELLOW}ℹ️  El enlace de storage ya existe o hubo un error.${NC}"
    
    echo -e "\n${GREEN}✅ Despliegue completado!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Frontend:  ${GREEN}http://localhost:2901${NC}"
    echo -e "Backend:   ${GREEN}http://localhost:8000${NC}"
    echo -e "MySQL:     ${GREEN}localhost:3306${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Función para detener los contenedores
stop() {
    echo -e "${YELLOW}🛑 Deteniendo contenedores...${NC}"
    docker compose stop
    echo -e "${GREEN}✅ Contenedores detenidos${NC}"
}

# Función para reiniciar los contenedores
restart() {
    echo -e "${YELLOW}🔄 Reiniciando contenedores...${NC}"
    docker compose restart
    echo -e "${GREEN}✅ Contenedores reiniciados${NC}"
}

# Función para ver logs
logs() {
    echo -e "${YELLOW}📋 Mostrando logs (Ctrl+C para salir)...${NC}"
    docker compose logs -f
}

# Función para limpiar todo
clean() {
    echo -e "${RED}⚠️  ADVERTENCIA: Esto eliminará todos los contenedores y volúmenes (incluida la base de datos)${NC}"
    read -p "¿Estás seguro? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🧹 Limpiando contenedores y volúmenes...${NC}"
        docker compose down -v
        echo -e "${GREEN}✅ Limpieza completada${NC}"
    else
        echo -e "${YELLOW}❌ Operación cancelada${NC}"
    fi
}

# Función para mostrar el estado
status() {
    echo -e "${YELLOW}📊 Estado de los contenedores:${NC}"
    docker compose ps
    echo ""
    echo -e "${YELLOW}💾 Volúmenes:${NC}"
    docker volume ls | grep link-in-bio
}

# Menú principal
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    clean)
        clean
        ;;
    status)
        status
        ;;
    *)
        echo -e "${YELLOW}Uso: $0 {start|stop|restart|logs|status|clean}${NC}"
        echo ""
        echo "Comandos disponibles:"
        echo "  start   - Construir e iniciar todos los contenedores"
        echo "  stop    - Detener todos los contenedores"
        echo "  restart - Reiniciar todos los contenedores"
        echo "  logs    - Ver logs en tiempo real"
        echo "  status  - Ver estado de contenedores y volúmenes"
        echo "  clean   - Eliminar contenedores y volúmenes (⚠️  incluye BD)"
        exit 1
        ;;
esac
