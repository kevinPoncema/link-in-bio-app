<?php

namespace App\Services;

use App\Repositories\ProfileRepository;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileService
{
    protected $profileRepository;

    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    /**
     * Procesa y guarda la imagen de perfil (base64 o archivo).
     * Retorna la URL pública de la imagen guardada o null.
     *
     * @param mixed $imageData Puede ser string base64, UploadedFile o null
     * @param string|null $oldImageUrl URL de la imagen anterior para eliminarla
     * @return string|null
     */
    protected function handleProfilePicture($imageData, ?string $oldImageUrl = null): ?string
    {
        // Si no hay imagen, retornar null
        if (!$imageData) {
            return null;
        }

        // Eliminar la imagen anterior si existe
        if ($oldImageUrl) {
            $this->deleteOldImage($oldImageUrl);
        }

        // Caso 1: Imagen en base64
        if (is_string($imageData) && Str::startsWith($imageData, 'data:image')) {
            return $this->saveBase64Image($imageData);
        }

        // Caso 2: Archivo subido directamente (UploadedFile)
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
        preg_match('/data:image\/(\w+);base64,(.*)/', $base64Data, $matches);
        
        if (count($matches) !== 3) {
            return null;
        }

        $extension = $matches[1];
        $imageContent = base64_decode($matches[2]);
        
        $fileName = time() . '_' . Str::random(10) . '.' . $extension;
        $disk = config('images.profile_pictures.disk');
        $storagePath = config('images.profile_pictures.path') . '/' . $fileName;
        
        Storage::disk($disk)->put($storagePath, $imageContent, 'public');
        
        return Storage::disk($disk)->url($storagePath);
    }

    /**
     * Guarda un archivo subido directamente
     *
     * @param mixed $file
     * @return string|null
     */
    protected function saveUploadedFile($file): ?string
    {
        $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $disk = config('images.profile_pictures.disk');
        $storagePath = config('images.profile_pictures.path') . '/' . $fileName;
        
        Storage::disk($disk)->put($storagePath, file_get_contents($file), 'public');
        
        return Storage::disk($disk)->url($storagePath);
    }

    /**
     * Elimina una imagen antigua del storage
     *
     * @param string $imageUrl
     * @return void
     */
    protected function deleteOldImage(string $imageUrl): void
    {
        try {
            $disk = config('images.profile_pictures.disk');
            $basePath = config('images.profile_pictures.path');
            
            // Extraemos el nombre del archivo de la URL buscando la última parte después del /
            $parts = explode('/', $imageUrl);
            $fileName = end($parts);
            
            if ($fileName) {
                $storagePath = $basePath . '/' . $fileName;
                
                if (Storage::disk($disk)->exists($storagePath)) {
                    Storage::disk($disk)->delete($storagePath);
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Error al eliminar imagen antigua: ' . $e->getMessage());
        }
    }

    /**
     * Limpia la URL eliminando caracteres escapados
     *
     * @param string $url
     * @return string
     */
    protected function cleanUrl(string $url): string
    {
        // Eliminar barras escapadas
        return str_replace('\\/', '/', $url);
    }

    /**
     * Obtiene todos los perfiles asociados a un usuario específico.
     *
     * @param int $userId ID del usuario autenticado
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProfilesByUserId(int $userId)
    {
        try {
            return $this->profileRepository->getByUserId($userId);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene un perfil por su ID primario o slug.
     *
     * @param string|int $identifier
     * @return Profile|null
     */
    public function getProfileByIdOrSlug(string|int $identifier): ?Profile
    {
        try {
            if (is_numeric($identifier)) {
                return $this->profileRepository->findById((int)$identifier);
            }
            return $this->profileRepository->findBySlug($identifier);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Crea un perfil.
     * Se usa en el controlador.
     *
     * @param array $data
     * @return Profile
     */
    public function createProfile(array $data): Profile
    {
        try {
            // Procesar imagen si existe
            if (isset($data['profile_picture'])) {
                $imageUrl = $this->handleProfilePicture($data['profile_picture']);
                if ($imageUrl) {
                    $data['profile_picture_url'] = $imageUrl;
                }
                unset($data['profile_picture']); // Remover el dato base64/archivo
            }

            return $this->profileRepository->create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualiza el perfil de un usuario específico.
     *
     * @param int $profileId ID del perfil
     * @param array $data
     * @return Profile|null
     */
    public function updateProfileById(int $profileId, array $data): ?Profile
    {
        try {
            $profile = $this->profileRepository->findById($profileId);

            if (!$profile) {
                return null;
            }

            // Procesar imagen si existe
            if (isset($data['profile_picture'])) {
                $imageUrl = $this->handleProfilePicture(
                    $data['profile_picture'],
                    $profile->profile_picture_url // Pasar la URL anterior para eliminarla
                );
                
                if ($imageUrl) {
                    $data['profile_picture_url'] = $imageUrl;
                }
                unset($data['profile_picture']); // Remover el dato base64/archivo
            }

            $this->profileRepository->update($profile, $data);
            return $profile;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Elimina el perfil de un usuario específico.
     *
     * @param int $userId
     * @return bool
     */
    public function deleteProfileById(int $profileId): bool
    {
        try {
            $profile = $this->profileRepository->findById($profileId);
            if (!$profile) {
                return false;
            }
            return $this->profileRepository->delete($profile);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}