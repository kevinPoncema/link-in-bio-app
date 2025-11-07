<?php

namespace App\Repositories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Collection;

class ProfileRepository
{
    /**
     * Obtiene el perfil por el ID del usuario (FK user_id).
     *
     * @param int $userId
     * @return Profile|null
     */
    public function getByUserId(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        try {
            return Profile::where('user_id', $userId)->get();
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
    public function findById(int $id): ?Profile
    {
        try {
            return Profile::find($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function findBySlug(string $slug): ?Profile
    {
        try {
            return Profile::where('slug', $slug)->first();
        } catch (\Exception $e) {
            throw $e;
        }
    }
    /**
     * Crea un nuevo perfil.
     *
     * @param array $data
     * @return Profile
     */
    public function create(array $data): Profile
    {
        try {
            return Profile::create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualiza un perfil existente.
     *
     * @param Profile $profile
     * @param array $data
     * @return bool
     */
    public function update(Profile $profile, array $data): bool
    {
        try {
            return $profile->update($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Elimina un perfil.
     *
     * @param Profile $profile
     * @return bool|null
     */
    public function delete(Profile $profile): ?bool
    {
        try {
            return $profile->delete();
        } catch (\Exception $e) {
            throw $e;
        }
    }
}