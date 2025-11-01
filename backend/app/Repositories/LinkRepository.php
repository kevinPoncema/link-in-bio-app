<?php

namespace App\Repositories;

use App\Models\Link;
use Illuminate\Database\Eloquent\Collection;

class LinkRepository
{
    /**
     * Obtiene todos los links de un perfil específico.
     *
     * @param int $profileId
     * @return Collection
     */
    public function getAllByProfileId(int $profileId): Collection
    {
        return Link::where('profile_id', $profileId)->orderBy('order')->get();
    }

    /**
     * Obtiene un link por su ID.
     *
     * @param int $id
     * @return Link|null
     */
    public function findById(int $id): ?Link
    {
        return Link::find($id);
    }

    /**
     * Crea un nuevo link.
     *
     * @param array $data
     * @return Link
     */
    public function create(array $data): Link
    {
        return Link::create($data);
    }

    /**
     * Actualiza un link existente.
     *
     * @param Link $link
     * @param array $data
     * @return bool
     */
    public function update(Link $link, array $data): bool
    {
        return $link->update($data);
    }

    /**
     * Elimina un link.
     *
     * @param Link $link
     * @return bool|null
     */
    public function delete(Link $link): ?bool
    {
        return $link->delete();
    }
}