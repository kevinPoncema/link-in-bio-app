<?php

namespace App\Services;

use App\Repositories\ProfileRepository;
use App\Models\Profile;

class ProfileService
{
    protected $profileRepository;

    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    /**
     * Obtiene todos los perfiles asociados a un usuario específico.
     *
     * @param int $userId ID del usuario autenticado
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProfilesByUserId(int $userId)
    {
        return $this->profileRepository->getByUserId($userId);
    }

    /**
     * Obtiene un perfil por su ID primario.
     *
     * @param int $id
     * @return Profile|null
     */
    public function getProfileById(int $id): ?Profile
    {
        return $this->profileRepository->findById($id);
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
        // Aquí se podría agregar lógica para verificar si el slug ya existe,
        // generar un slug automáticamente, o manejar la subida de imágenes.
        return $this->profileRepository->create($data);
    }

    /**
     * Actualiza el perfil de un usuario específico.
     *
     * @param int $userId ID del usuario propietario
     * @param array $data
     * @return Profile|null
     */
    public function updateProfileByUserId(int $userId, array $data): ?Profile
    {
        $profile = $this->profileRepository->findByUserId($userId);

        if (!$profile) {
            return null;
        }

        $this->profileRepository->update($profile, $data);
        return $profile;
    }

    /**
     * Elimina el perfil de un usuario específico.
     *
     * @param int $userId
     * @return bool
     */
    public function deleteProfileByUserId(int $userId): bool
    {
        $profile = $this->profileRepository->findByUserId($userId);

        if (!$profile) {
            return false;
        }

        return $this->profileRepository->delete($profile);
    }
}