<?php

namespace App\Repositories;

use App\Models\Theme;
use Illuminate\Database\Eloquent\Collection;

class ThemeRepository
{
    /**
     * Obtener todos los temas.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Theme::all();
    }

    /**
     * Obtener solo temas del sistema.
     *
     * @return Collection
     */
    public function getSystemThemes(): Collection
    {
        return Theme::system()->get();
    }

    /**
     * Obtener temas personalizados de un usuario.
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserThemes(int $userId): Collection
    {
        return Theme::custom()
            ->where('user_id', $userId)
            ->get();
    }

    /**
     * Obtener un tema por su ID.
     *
     * @param int $id
     * @return Theme|null
     */
    public function findById(int $id): ?Theme
    {
        return Theme::find($id);
    }

    /**
     * Crear un nuevo tema.
     *
     * @param array $data
     * @return Theme
     */
    public function create(array $data): Theme
    {
        return Theme::create($data);
    }

    /**
     * Actualizar un tema existente.
     *
     * @param Theme $theme
     * @param array $data
     * @return bool
     */
    public function update(Theme $theme, array $data): bool
    {
        return $theme->update($data);
    }

    /**
     * Eliminar un tema.
     *
     * @param Theme $theme
     * @return bool|null
     */
    public function delete(Theme $theme): ?bool
    {
        return $theme->delete();
    }
}
