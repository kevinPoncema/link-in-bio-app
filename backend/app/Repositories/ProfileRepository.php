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
        return Profile::where('user_id', $userId)->get();
    }

    /**
     * Obtiene un perfil por su ID primario.
     *
     * @param int $id
     * @return Profile|null
     */
    public function findById(int $id): ?Profile
    {
        return Profile::find($id);
    }

    /**
     * Crea un nuevo perfil.
     *
     * @param array $data
     * @return Profile
     */
    public function create(array $data): Profile
    {
        return Profile::create($data);
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
        return $profile->update($data);
    }

    /**
     * Elimina un perfil.
     *
     * @param Profile $profile
     * @return bool|null
     */
    public function delete(Profile $profile): ?bool
    {
        return $profile->delete();
    }
}