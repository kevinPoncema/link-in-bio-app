# Documentación: Sistema de Subida de Imágenes de Perfil

## 🎯 Implementación Completa

### Backend (Laravel)

#### 1. **ProfileService.php** - Lógica de guardado de imágenes

**Ubicación:** `/backend/app/Services/ProfileService.php`

**Funciones principales:**

- `handleProfilePicture($imageData, $oldImageUrl)` - Función principal que coordina el guardado
- `saveBase64Image($base64Data)` - Procesa y guarda imágenes en formato base64
- `saveUploadedFile($file)` - Procesa archivos subidos directamente
- `getImageUrl($fileName)` - Construye la URL completa con el dominio del backend
- `deleteOldImage($imageUrl)` - Elimina imágenes antiguas al actualizar

**Flujo de guardado:**
```
1. Recibe imagen (base64 o UploadedFile)
2. Extrae extensión y contenido
3. Genera nombre único: timestamp_random.ext
4. Guarda en: storage/app/public/profile_pictures/
5. Retorna URL completa: http://localhost:8000/storage/profile_pictures/filename.ext
```

**Configuración de Storage:**
- Disco: `public` (definido en `config/filesystems.php`)
- Directorio: `storage/app/public/profile_pictures/`
- Enlace simbólico: `public/storage` → `storage/app/public`
- Comando ejecutado: `php artisan storage:link`

#### 2. **ProfileController.php** - API Endpoints

**Cambios realizados:**
- Validación: Acepta campo `profile_picture` (nullable|string)
- Flag JSON: Agregado `JSON_UNESCAPED_SLASHES` para evitar barras escapadas
- Métodos actualizados: `store()`, `update()`, `index()`, `show()`

**Ejemplo de respuesta JSON:**
```json
{
  "id": 1,
  "main_title": "Kevin Ponce",
  "slug": "kevin-ponce",
  "description": "Developer",
  "profile_picture_url": "http://localhost:8000/storage/profile_pictures/1762624597_l4YC5jurSV.jpeg",
  "theme_name": "sunset"
}
```

### Frontend (React)

#### 1. **imageHelpers.js** - Utilidades para imágenes

**Ubicación:** `/frontend/src/utils/imageHelpers.js`

**Funciones:**

```javascript
// Procesa URLs de imágenes (relativas, absolutas o base64)
getFullImageUrl(imageUrl)

// Valida archivos de imagen (tipo y tamaño)
validateImageFile(file)

// Convierte File a base64
fileToBase64(file)
```

**Validaciones:**
- Tipos aceptados: `image/*` (jpg, png, gif, etc.)
- Tamaño máximo: 5MB
- Retorna: `{ valid: boolean, error: string|null }`

#### 2. **Componentes actualizados**

**ProfileEdit.jsx:**
- Importa y usa `imageHelpers`
- Muestra preview de imagen con URL completa
- Validación antes de convertir a base64
- Manejo de errores mejorado

**ProfileForm.jsx:**
- Modal de creación de perfiles
- Preview circular de 32x32 con hover effect
- Botones: "Seleccionar Imagen", "Cambiar Imagen", "Quitar"
- Validación en tiempo real

**PublicProfile.jsx:**
- Muestra imagen de perfil en vista pública
- Usa `getFullImageUrl()` para construir URL completa
- Fallback a icono de usuario si no hay imagen

**ProfileCard.jsx:**
- Thumbnail de 16x16 en lista de perfiles
- Muestra imagen en tarjetas del dashboard
- Usa helper para URL completa

#### 3. **ProfileRequest.js** - API Client

**Cambios:**
- `createProfile()` - Envía campo `profile_picture` con base64
- `updateProfile()` - Actualiza campo `profile_picture`
- Ambos métodos envían JSON con imagen en base64

## 🔄 Flujo Completo de Subida

### Crear Perfil con Imagen

```
1. Usuario selecciona imagen → <input type="file">
2. ProfileForm valida archivo (tipo + tamaño)
3. fileToBase64() convierte a base64
4. Se actualiza state: formData.profile_picture
5. Se muestra preview con imagePreview
6. Al submit → ProfileRequest.createProfile()
7. Backend recibe JSON con base64
8. ProfileService.saveBase64Image() procesa
9. Guarda archivo en storage/app/public/profile_pictures/
10. Retorna URL completa: http://localhost:8000/storage/profile_pictures/...
11. Se guarda en BD: profile_picture_url
12. Frontend recibe respuesta y actualiza
```

### Actualizar Imagen de Perfil

```
1. ProfileEdit carga perfil existente
2. loadProfile() obtiene profile_picture_url
3. getFullImageUrl() construye URL completa
4. Se muestra en preview
5. Usuario selecciona nueva imagen
6. Se convierte a base64
7. Al guardar → ProfileRequest.updateProfile()
8. Backend: handleProfilePicture() recibe nueva imagen
9. deleteOldImage() elimina imagen anterior
10. saveBase64Image() guarda nueva imagen
11. Retorna nueva URL completa
12. Frontend actualiza preview
```

## 📁 Estructura de Archivos

### Backend
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   └── ProfileController.php (JSON_UNESCAPED_SLASHES)
│   └── Services/
│       └── ProfileService.php (Lógica completa de imágenes)
├── storage/
│   └── app/
│       └── public/
│           └── profile_pictures/ (Imágenes guardadas aquí)
└── public/
    └── storage/ → ../storage/app/public (Enlace simbólico)
```

### Frontend
```
frontend/
├── src/
│   ├── api/
│   │   └── ProfileRequest.js (API calls con profile_picture)
│   ├── components/
│   │   ├── ProfileCard.jsx (Usa getFullImageUrl)
│   │   └── ProfileForm.jsx (Upload + preview)
│   ├── pages/
│   │   ├── ProfileEdit.jsx (Upload + preview)
│   │   └── PublicProfile.jsx (Muestra imagen pública)
│   └── utils/
│       └── imageHelpers.js (Helpers centralizados)
└── .env (VITE_API_BASE_URL=http://localhost:8000)
```

## 🔒 Seguridad y Validaciones

### Backend
- ✅ Validación de tipo: Solo strings (base64) o UploadedFile
- ✅ Nombres únicos: `timestamp_random.extension`
- ✅ Eliminación de imágenes antiguas al actualizar
- ✅ Try-catch en eliminación para no detener la ejecución
- ✅ Logging de errores en eliminación

### Frontend
- ✅ Validación de tipo: Solo `image/*`
- ✅ Validación de tamaño: Máximo 5MB
- ✅ Mensajes de error amigables
- ✅ Conversión segura a base64 con Promise
- ✅ Manejo de errores en conversión

## 🌐 URLs y Acceso

### Desarrollo
- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:5173
- **Imágenes:** http://localhost:8000/storage/profile_pictures/filename.ext

### Configuración
```env
# Backend: .env
APP_URL=http://localhost:8000

# Frontend: .env
VITE_API_BASE_URL=http://localhost:8000
```

## 🚀 Comandos Necesarios

```bash
# Backend - Crear enlace simbólico (YA EJECUTADO)
cd backend
php artisan storage:link

# Backend - Crear directorio si no existe (YA CREADO)
mkdir -p storage/app/public/profile_pictures

# Backend - Permisos (si es necesario)
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## 📝 Notas Importantes

1. **JSON_UNESCAPED_SLASHES:** Evita que Laravel escape las barras en URLs
2. **getFullImageUrl():** Maneja URLs relativas, absolutas y base64
3. **Enlace Simbólico:** Necesario para acceder a `storage/app/public` desde web
4. **Base64:** Se usa para transmitir imágenes del frontend al backend
5. **Storage Disk:** Configurado en `config/filesystems.php` como `public`

## ✅ Testing

### Probar Subida de Imagen

1. Crear nuevo perfil con imagen
2. Verificar que se guarda en `storage/app/public/profile_pictures/`
3. Verificar que la URL retornada es accesible
4. Actualizar perfil con nueva imagen
5. Verificar que la imagen anterior se eliminó
6. Ver imagen en perfil público

### Verificar URL
```bash
# Verificar que el archivo existe
ls -la backend/storage/app/public/profile_pictures/

# Verificar acceso web
curl http://localhost:8000/storage/profile_pictures/[filename]
```

## 🐛 Troubleshooting

**Problema:** Imagen no se muestra
- ✅ Verificar enlace simbólico: `ls -la backend/public/storage`
- ✅ Verificar permisos: `chmod -R 775 backend/storage`
- ✅ Verificar URL en consola del navegador

**Problema:** Barras escapadas en JSON
- ✅ Verificar `JSON_UNESCAPED_SLASHES` en ProfileController

**Problema:** Error al subir imagen
- ✅ Verificar tamaño (máx 5MB)
- ✅ Verificar tipo de archivo (solo imágenes)
- ✅ Ver errores en consola del navegador
