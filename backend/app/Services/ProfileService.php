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
        try {
            return $this->profileRepository->getByUserId($userId);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene un perfil por su ID primario.
     *
     * @param int $id
     * @return Profile|null
     */
    public function getProfileById(int $id): ?Profile
    {
        try {
            return $this->profileRepository->findById($id);
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
            // Permitir que un usuario tenga varios perfiles, solo se valida el slug único en la capa de controlador
            return $this->profileRepository->create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualiza el perfil de un usuario específico.
     *
     * @param int $userId ID del usuario propietario
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