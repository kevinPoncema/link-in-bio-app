# 🛠️ Documento de Diseño del Sistema (DDS)

## 📌 Propósito General

El sistema es una plataforma web modular, rápida y adaptable (tipo "Link in Bio") que permite a los usuarios gestionar uno o varios perfiles públicos. Cada perfil sirve como un concentrador de enlaces personalizados, altamente configurable en cuanto a contenido (links, descripción, foto) y diseño (temas). El objetivo es centralizar la presencia digital del usuario en una única URL optimizada para dispositivos móviles.
1. Propósito General
El sistema es una plataforma web modular, rápida y adaptable (tipo "Link in Bio") que permite a los usuarios gestionar uno o varios perfiles públicos. Cada perfil sirve como un concentrador de enlaces personalizados, altamente configurable en cuanto a contenido (links, descripción, foto) y diseño (temas). El objetivo es centralizar la presencia digital del usuario en una única URL optimizada para dispositivos móviles.

## 🚀 Despliegue y Contenerización

### Estrategia de Despliegue y CI/CD

La infraestructura del sistema se basa en la contenerización para garantizar la portabilidad y la consistencia entre entornos:

- **Contenerización**: El backend de Laravel y el frontend de React serán empaquetados en contenedores Docker independientes.
- **Entorno de Producción**: El despliegue final se realizará en un VPS personal.
- **CI/CD**: Se utilizará Dockpoy para automatizar el despliegue. Tras cada push exitoso a la rama principal (main), Dockpoy reconstruirá y desplegará automáticamente los contenedores en el VPS.

## 💻 Backend

### Tecnologías y Arquitectura

El backend se implementará como una API RESTful utilizando PHP y el framework Laravel. La autenticación se gestionará con Laravel Passport, proporcionando tokens de acceso para proteger las rutas de administración.

### Estructura de Carpetas del Backend (Laravel)

Se utilizará un patrón de Servicios y Repositorios para desacoplar la lógica de negocio de la lógica de acceso a datos (Eloquent).

```
app/
├── Http/
│   ├── Controllers/    # Lógica de enrutamiento y llamada a Services
│   ├── Requests/       # Validación de datos de entrada (Form Requests)
│   └── Resources/      # Formato de datos de salida (API Resources)
├── Models/             # Modelos Eloquent
├── Repositories/       # Capa de Acceso a Datos (Consultas directas a DB/Eloquent)
└── Services/           # Capa de Lógica de Negocio (El cerebro de la aplicación)
```

Explicación de la Estructura de Carpetas:

- **Http/Controllers**: Actúa como el punto de entrada de la petición, maneja la solicitud y delega la ejecución de la lógica al Service correspondiente, y retorna la respuesta (usando Resources).

- **Http/Requests**: Aloja las validaciones de datos de entrada del usuario, garantizando la integridad de los datos antes de que lleguen a la capa de negocio.

- **Http/Resources**: Se utiliza para estructurar y dar formato a los datos de los modelos Eloquent antes de enviarlos como respuesta JSON al frontend.

- **Models**: Define los modelos de Eloquent, mapeando la estructura de las tablas de MySQL.

- **Repositories**: Esta es la Capa de Acceso a Datos (DAL). Contiene la implementación pura de las consultas de Eloquent, aislando la lógica específica de la base de datos de los Services.

- **Services**: Contiene la Lógica de Negocio central. Define las reglas de la aplicación, coordina las acciones entre diferentes modelos y llama a los Repositories para la manipulación de datos.

### Endpoints de la API (Resumen Funcional)

| Método | Ruta | Propósito | Autenticación |
|--------|------|-----------|---------------|
| POST | `/api/login` | Autenticación del usuario (retorna token) | No |
| GET | `/api/profile/{slug}` | Visualización PÚBLICA del perfil y sus enlaces | No |
| PUT/PATCH | `/api/user/profile` | Actualiza la información (título, descripción, tema) del perfil activo | Sí (Passport Token) |
| GET | `/api/links` | Obtiene todos los enlaces del perfil autenticado, ordenados | Sí (Passport Token) |
| POST/PUT/DELETE | `/api/links` / `/api/links/{id}` | CRUD de enlaces | Sí (Passport Token) |
| PUT/PATCH | `/api/links/reorder` | Actualiza el campo order de un conjunto de enlaces tras la acción de arrastrar y soltar | Sí (Passport Token) |

### Motor de Base de Datos y Entidades

#### Motor de Base de Datos
Se utilizará MySQL como motor de base de datos relacional.

#### Diagrama Conceptual de la Base de Datos (Modelo Entidad-Relación)
Este diagrama muestra las entidades principales, sus atributos y las relaciones que implementan la funcionalidad de múltiples perfiles.

```mermaid
erDiagram
    users ||--o{ profiles : "has"
    profiles ||--o{ links : "includes"

    users {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UNIQUE
        VARCHAR password
        VARCHAR remember_token
    }

    profiles {
        BIGINT id PK
        BIGINT user_id FK "Owner"
        VARCHAR profile_picture_url "S3 or local URL"
        VARCHAR main_title
        TEXT description
        VARCHAR slug UNIQUE "Public URL identifier"
        VARCHAR theme_name "Selected design theme name"
    }

    links {
        BIGINT id PK
        BIGINT profile_id FK
        VARCHAR title
        VARCHAR url
        VARCHAR icon_class "Font Awesome class name"
        INTEGER order "Display position for drag-and-drop"
    }
```
# Frontend
🖥️ Tecnologías y Arquitectura
El frontend se desarrollará como una Single Page Application (SPA) utilizando React.

### Librerías Clave

- **react-beautiful-dnd**: Para la implementación del arrastrar y soltar (drag and drop) en la gestión de enlaces.
- **Fetch/Axios**: Para realizar las peticiones asíncronas a la API de Laravel.

### Estructura de Carpetas del Frontend (React)

La siguiente estructura es un punto de partida simplificado para el aprendizaje, priorizando la separación de la lógica de comunicación y la presentación.

```
src/
├── api/             # Lógica de comunicación con Laravel
├── assets/          # Recursos estáticos
├── components/      # Componentes de presentación (UI)
├── hooks/           # Lógica personalizada (useFetch, useDragAndDrop)
├── pages/           # Contenedores o rutas principales (manejan estado y flujo)
└── App.jsx          # Componente principal y manejo de rutas
```

### Explicación de la Estructura de Carpetas

- **api/**: Aloja las funciones que encapsulan la comunicación HTTP con la API de Laravel. Los componentes y pages solo interactúan con estas funciones, sin preocuparse por los detalles de la URL o los headers del token.

- **assets/**: Contiene todos los archivos estáticos (imágenes, fuentes, hojas de estilo globales) que no son código React.

- **components/**: Agrupa los componentes reutilizables y presentacionales. Estos reciben datos a través de props y se enfocan en la apariencia (look and feel).

- **hooks/**: Centraliza toda la lógica compleja (manejo de estado, efectos secundarios, algoritmos de Drag and Drop) para que pueda ser reutilizada fácilmente en cualquier parte de la aplicación.

- **pages/**: Contiene los componentes que representan las vistas completas de la aplicación (ej. `Login.jsx`, `Admin.jsx`, `PublicProfile.jsx`). Estos manejan la lógica de estado y flujo.

> **Nota Importante**: Esta estructura es provisional y simplificada para facilitar la curva de aprendizaje inicial. A medida que el proyecto evolucione y la complejidad aumente (por ejemplo, con la introducción de la gestión de estado global), esta estructura podría ser refactorizada para incluir capas como `context/` o `store/` para un manejo más escalable.