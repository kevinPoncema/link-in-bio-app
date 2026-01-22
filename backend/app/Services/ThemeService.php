<?php

namespace App\Services;

use App\Repositories\ThemeRepository;
use App\Models\Theme;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ThemeService
{
    protected $themeRepository;

    public function __construct(ThemeRepository $themeRepository)
    {
        $this->themeRepository = $themeRepository;
    }

    /**
     * Procesa y guarda la imagen de preview (base64, archivo o URL).
     * Retorna la URL pública de la imagen guardada o null.
     *
     * @param mixed $imageData Puede ser string base64, UploadedFile, URL o null
     * @param string|null $oldImageUrl URL de la imagen anterior para eliminarla
     * @return string|null
     */
    protected function handlePreviewImage($imageData, ?string $oldImageUrl = null): ?string
    {
        // Si no hay imagen, retornar null
        if (!$imageData) {
            return null;
        }

        // Eliminar la imagen anterior si existe y no es URL externa
        if ($oldImageUrl && !Str::startsWith($oldImageUrl, 'http')) {
            $this->deleteOldImage($oldImageUrl);
        }

        // Caso 1: URL externa (Unsplash, etc.)
        if (is_string($imageData) && (Str::startsWith($imageData, 'http://') || Str::startsWith($imageData, 'https://'))) {
            // Validar que la URL sea válida
            if (filter_var($imageData, FILTER_VALIDATE_URL)) {
                return $imageData; // Retornar la URL tal cual
            }
            return null;
        }

        // Caso 2: Imagen en base64
        if (is_string($imageData) && Str::startsWith($imageData, 'data:image')) {
            return $this->saveBase64Image($imageData);
        }

        // Caso 3: Archivo subido directamente (UploadedFile)
        if (is_object($imageData) && method_exists($imageData, 'getClientOriginalExtension')) {
            return $this->saveUploadedFile($imageData);
        }

        return null;
    }

    /**
     * Guarda una imagen desde base64
     *
     * @param string $base64Data
     * @return string|null
     */
    protected function saveBase64Image(string $base64Data): ?string
    {
        // Extraer el tipo de imagen y los datos
        preg_match('/data:image\/(\w+);base64,(.*)/', $base64Data, $matches);
        
        if (count($matches) !== 3) {
            return null;
        }

        $extension = $matches[1];
        $imageContent = base64_decode($matches[2]);
        
        // Generar nombre único
        $fileName = 'theme_' . time() . '_' . Str::random(10) . '.' . $extension;
        $storagePath = 'theme_previews/' . $fileName;
        
        // Guardar la imagen
        Storage::disk('public')->put($storagePath, $imageContent);
        
        // Retornar la URL completa
        return $this->getImageUrl($fileName);
    }

    /**
     * Guarda un archivo subido directamente
     *
     * @param mixed $file
     * @return string|null
     */
    protected function saveUploadedFile($file): ?string
    {
        $fileName = 'theme_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $storagePath = 'theme_previews/' . $fileName;
        
        Storage::disk('public')->put($storagePath, file_get_contents($file));
        
        return $this->getImageUrl($fileName);
    }

    /**
     * Obtiene la URL completa de la imagen
     *
     * @param string $fileName
     * @return string
     */
    protected function getImageUrl(string $fileName): string
    {
        $backendUrl = config('app.url');
        return "{$backendUrl}/storage/theme_previews/{$fileName}";
    }

    /**
     * Elimina una imagen anterior del storage
     *
     * @param string $imageUrl
     * @return void
     */
    protected function deleteOldImage(string $imageUrl): void
    {
        // Extraer el nombre del archivo de la URL
        $fileName = basename(parse_url($imageUrl, PHP_URL_PATH));
        $storagePath = 'theme_previews/' . $fileName;
        
        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->delete($storagePath);
        }
    }

    /**
     * Obtener todos los temas
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllThemes()
    {
        return $this->themeRepository->getAll();
    }

    /**
     * Obtener temas del sistema
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getSystemThemes()
    {
        return $this->themeRepository->getSystemThemes();
    }

    /**
     * Obtener temas personalizados de un usuario
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserThemes(int $userId)
    {
        return $this->themeRepository->getUserThemes($userId);
    }

    /**
     * Obtener un tema por ID
     *
     * @param int $id
     * @return Theme|null
     */
    public function getThemeById(int $id): ?Theme
    {
        return $this->themeRepository->findById($id);
    }

    /**
     * Crear un nuevo tema
     *
     * @param array $data
     * @return Theme
     * @throws ValidationException
     */
    public function createTheme(array $data): Theme
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'preview_url' => 'nullable',
            'primary_color' => 'required|string|max:50',
            'secondary_color' => 'required|string|max:50',
            'background_color' => 'required|string|max:50',
            'is_custom' => 'boolean',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($data['preview_url'])) {
            $data['preview_url'] = $this->handlePreviewImage($data['preview_url']);
        }

        return $this->themeRepository->create($data);
    }

    /**
     * Actualizar un tema existente
     *
     * @param int $id
     * @param array $data
     * @return Theme
     * @throws \Exception
     */
    public function updateTheme(int $id, array $data): Theme
    {
        $theme = $this->themeRepository->findById($id);

        if (!$theme) {
            throw new \Exception('Tema no encontrado');
        }

        $validator = Validator::make($data, [
            'name' => 'sometimes|required|string|max:255',
            'preview_url' => 'nullable',
            'primary_color' => 'sometimes|required|string|max:50',
            'secondary_color' => 'sometimes|required|string|max:50',
            'background_color' => 'sometimes|required|string|max:50',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($data['preview_url'])) {
            $oldPreview = $theme->preview_url;
            $data['preview_url'] = $this->handlePreviewImage($data['preview_url'], $oldPreview);
        }
        $this->themeRepository->update($theme, $data);

        return $theme->fresh();
    }

    /**
     * Eliminar un tema
     *
     * @param int $id
     * @return bool
     * @throws \Exception
     */
    public function deleteTheme(int $id): bool
    {
        $theme = $this->themeRepository->findById($id);

        if (!$theme) {
            throw new \Exception('Tema no encontrado');
        }

        if ($theme->preview_url && !Str::startsWith($theme->preview_url, 'http')) {
            $this->deleteOldImage($theme->preview_url);
        }

        return $this->themeRepository->delete($theme);
    }
}
