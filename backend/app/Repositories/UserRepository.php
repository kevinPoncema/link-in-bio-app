<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    /**
     * Obtiene todos los usuarios.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        try {
            return User::all();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Busca usuarios por una coincidencia parcial en el nombre.
     *
     * @param string $name
     * @return Collection
     */
    public function searchByName(string $name): Collection
    {
        try {
            return User::where('name', 'like', '%' . $name . '%')->get();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User
    {
        try {
            return User::find($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene un usuario por su email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        try {
            return User::where('email', $email)->first();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Crea un nuevo usuario.
     *
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        try {
            return User::create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param User $user
     * @param array $data
     * @return bool
     */
    public function update(User $user, array $data): bool
    {
        try {
            return $user->update($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Elimina un usuario.
     *
     * @param User $user
     * @return bool|null
     */
    public function delete(User $user): ?bool
    {
        try {
            return $user->delete();
        } catch (\Exception $e) {
            throw $e;
        }
    }
}