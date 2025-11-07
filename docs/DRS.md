# 📄 Documento de Requerimientos del Sistema (DRS) Final

## 1. Introducción

El sistema es una plataforma web modular, rápida y adaptable (tipo "Link in Bio") que permite a los usuarios gestionar uno o varios perfiles públicos. Cada perfil sirve como un concentrador de enlaces personalizados, altamente configurable en cuanto a contenido (links, descripción, foto) y diseño (temas). El objetivo es centralizar la presencia digital del usuario en una única URL optimizada para dispositivos móviles.

---

## 2. Requerimientos Funcionales (RF)

### 2.1. Gestión de Cuentas y Múltiples Perfiles

| ID | Requerimiento Funcional | Descripción |
| :--- | :--- | :--- |
| **RF-101** | **Autenticación de Usuario** | El sistema debe implementar mecanismos seguros para el registro, inicio de sesión y recuperación de contraseña del Usuario. |
| **RF-102** | **Soporte para Múltiples Perfiles** | El sistema debe permitir que **un único Usuario** (dueño de la cuenta) pueda **crear y administrar múltiples Perfiles** ("Link in Bio") independientes. |
| **RF-103** | **Selección de Perfil** | El área de administración debe permitir al Usuario **seleccionar el Perfil activo** que desea editar en un momento dado. |
| **RF-104** | **URL de Perfil Única** | Cada Perfil debe permitir la configuración de un **identificador único (`slug`)** para generar su URL pública (ej: `/p/mi-perfil-personal`). |

### 2.2. Configuración y Personalización del Perfil

| ID | Requerimiento Funcional | Descripción |
| :--- | :--- | :--- |
| **RF-201** | **Gestión de Información** | El sistema debe permitir al Usuario actualizar el **Título principal**, la **Descripción (Biografía)**, y subir/actualizar la **Foto de Perfil** para el Perfil activo. |
| **RF-202** | **Gestión de Enlaces (CRUD)** | El sistema debe proporcionar una interfaz completa para **crear, leer, actualizar y eliminar** los enlaces asociados al Perfil activo. |
| **RF-203** | **Datos del Enlace** | Cada enlace debe incluir un **título visible**, la **URL de destino** y la capacidad de seleccionar un **ícono representativo** para el botón. |
| **RF-204** | **Reordenamiento Interactivo** | El sistema debe permitir al Usuario **arrastrar y soltar** los enlaces en la interfaz de administración para modificar su orden de aparición en la página pública. |
| **RF-205** | **Previsualización de Cambios** | El sistema debe mostrar una previsualización de la página pública mientras el Usuario realiza cambios en los enlaces y el diseño. |

### 2.3. Personalización de Diseño (Temas Detallado)

El sistema debe ofrecer una biblioteca de **Temas predefinidos** que se aplican con una única selección. Cada Tema debe modificar un conjunto coherente de elementos visuales.

| ID | Requerimiento Funcional | Detalle de los Elementos Afectados por el Tema |
| :--- | :--- | :--- |
| **RF-301** | **Selector de Temas** | El Usuario debe poder seleccionar el Tema deseado de una lista de opciones predefinidas. |
| **RF-302** | **Estilo del Fondo** | El Tema debe controlar el **fondo principal** de la página (colores sólidos, degradados o texturas/imágenes). |
| **RF-303** | **Estilo de Botones** | El Tema debe definir el **color de relleno**, el **estilo de los bordes** (cuadrado, redondeado, ovalado) y el **efecto visual** al interactuar (*hover*). |
| **RF-304** | **Estilo de Tipografía** | El Tema debe definir la **familia tipográfica (fuente)** y el **color del texto** utilizado en el Título, Descripción y dentro de los botones de enlace. |

### 2.4. Experiencia del Visitante

| ID | Requerimiento Funcional | Descripción |
| :--- | :--- | :--- |
| **RF-401** | **Acceso Público** | La página de Perfil debe ser completamente pública y accesible a través de su URL única (`/p/{slug}`). |
| **RF-402** | **Diseño Responsivo** | La página de Perfil debe **adaptarse automáticamente** para una visualización y funcionalidad óptimas en dispositivos móviles, tabletas y escritorios. |
| **RF-403** | **Redirección Rápida** | El clic en un enlace debe resultar en una **redirección inmediata** a la URL de destino. |

---

## 3. Requerimientos No Funcionales (RNF)

| ID | Requerimiento No Funcional | Categoría | Descripción |
| :--- | :--- | :--- | :--- |
| **RNF-101** | **Tiempo de Respuesta** | Rendimiento | La página de Perfil público debe cargar la información del usuario y los enlaces en **menos de 2 segundos**. |
| **RNF-102** | **Usabilidad** | Usabilidad | La interfaz de administración de enlaces y Temas debe ser **intuitiva y fácil de dominar** para el Usuario. |
| **RNF-103** | **Seguridad** | Seguridad | Todas las credenciales y datos sensibles (contraseñas, emails) deben ser **almacenados de forma segura (hasheados)**. |
| **RNF-104** | **Escalabilidad** | Mantenibilidad | La arquitectura debe ser diseñada para permitir un **fácil crecimiento** en el número de perfiles y enlaces gestionados. |
| **RNF-105** | **Compatibilidad** | Tecnología | El sistema debe ser compatible con los **navegadores web modernos** más utilizados (Chrome, Firefox, Safari, Edge). |

---

## 4. Alcance del Proyecto

* **Incluido:** Desarrollo de la aplicación web "Link in Bio" (página pública y panel de administración).
* **Opcional (Fase 2):** Adaptación a una aplicación móvil nativa (Android/iOS).
* **No Incluido Inicialmente:** Analíticas avanzadas de clics, dominios personalizados.