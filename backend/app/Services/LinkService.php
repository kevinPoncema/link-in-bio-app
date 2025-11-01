<?php

namespace App\Services;

use App\Repositories\LinkRepository;
use App\Repositories\ProfileRepository;
use App\Models\Link;
use App\Models\User;

class LinkService
{
    protected $linkRepository;
    protected $profileRepository;

    public function __construct(LinkRepository $linkRepository, ProfileRepository $profileRepository)
    {
        $this->linkRepository = $linkRepository;
        $this->profileRepository = $profileRepository;
    }

    /**
     * Verifica que el perfil exista y pertenezca al usuario dado.
     *
     * @param int $profileId
     * @param User $user Usuario autenticado
     * @return bool
     */
    public function verifyProfileOwnership(int $profileId, User $user): bool
    {
        $profile = $this->profileRepository->findById($profileId);

        // Verifica que el perfil exista Y que el user_id del perfil coincida con el ID del usuario autenticado
        return $profile && $profile->user_id === $user->id;
    }


    public function getLinksByProfileId(int $profileId)
    {
        return $this->linkRepository->getAllByProfileId($profileId);
    }

    public function getLinkById(int $linkId): ?Link
    {
        return $this->linkRepository->findById($linkId);
    }

    public function createLink(array $data, User $user): Link|null
    {
        if (!$this->verifyProfileOwnership($data['profile_id'], $user)) {
            return null; // No autorizado o perfil no existe
        }

        // Si el perfil es válido y es del usuario, creamos el link
        return $this->linkRepository->create($data);
    }

    public function updateLink(int $linkId, array $data, User $user): Link|null
    {
        $link = $this->linkRepository->findById($linkId);

        if (!$link) {
            return null; // Link no encontrado
        }

        // 1. El perfil del link DEBE pertenecer al usuario autenticado.
        if (!$this->verifyProfileOwnership($link->profile_id, $user)) {
            return null; // No autorizado para modificar este link
        }
        
        $this->linkRepository->update($link, $data);
        return $link->fresh();
    }

    public function deleteLink(int $linkId, User $user): bool
    {
        $link = $this->linkRepository->findById($linkId);

        if (!$link) {
            return false; // Link no encontrado
        }

        // Verifica que el perfil del link pertenezca al usuario autenticado
        if (!$this->verifyProfileOwnership($link->profile_id, $user)) {
            return false; // No autorizado
        }

        return $this->linkRepository->delete($link);
    }
}