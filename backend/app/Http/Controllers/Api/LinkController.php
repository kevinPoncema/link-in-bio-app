<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LinkService;
use App\Services\ProfileService; // Necesario para verificar la existencia del perfil en rutas públicas
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class LinkController extends Controller
{
    protected $linkService;
    protected $profileService;

    public function __construct(LinkService $linkService, ProfileService $profileService)
    {
        $this->linkService = $linkService;
        $this->profileService = $profileService;
    }

    // OBTENER TODOS LOS LINKS DE UN PERFIL (PÚBLICO)
    public function index(int $profile): JsonResponse
    {
        try {
            // 1. Verificar si el perfil existe (para rutas GET/Públicas)
            if (!$this->profileService->getProfileByIdOrSlug($profile)) {
                return response()->json(['message' => 'Perfil no encontrado.'], 404);
            }

            $links = $this->linkService->getLinksByProfileId($profile);

            return response()->json($links);

        } catch (\Exception $e) {
            // Error genérico del servidor
            return response()->json(['message' => 'Ocurrió un error al obtener los links.', 'error' => $e->getMessage()], 500);
        }
    }

    // OBTENER UN LINK POR ID (PÚBLICO)
    public function show(int $link): JsonResponse
    {
        try {
            $link = $this->linkService->getLinkById($link);

            if (!$link) {
                return response()->json(['message' => 'Link no encontrado.'], 404);
            }

            return response()->json($link);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error al obtener el link.', 'error' => $e->getMessage()], 500);
        }
    }

    // CREAR LINK (PROTEGIDO)
    public function store(Request $request): JsonResponse
    {
        try {
            // 1. Validación de campos
            $request->validate([
                'profile_id' => 'required|integer|exists:profiles,id',
                'title' => 'required|string|max:255',
                'url' => 'required|url|max:2048',
                'icon_class' => 'nullable|string|max:100',
                'order' => 'nullable|integer',
            ]);

            // 2. Lógica de negocio (Verificación de propiedad en el Service)
            $link = $this->linkService->createLink($request->all(), $request->user());

            if (!$link) {
                // El service devuelve null si el perfil no existe o no pertenece al usuario
                return response()->json(['message' => 'Perfil no existe o no te pertenece.'], 403); // 403 Prohibido
            }

            return response()->json($link, 201); // 201 Creado

        } catch (ValidationException $e) {
            // Error de validación: devuelve 422 Bad Request
            return response()->json(['message' => 'Los datos de la solicitud son inválidos.', 'errors' => $e->errors()], 422);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error al crear el link.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $link): JsonResponse
    {
        try {
            // 1. Validación de campos
            $request->validate([
                'profile_id' => 'sometimes|required|integer|exists:profiles,id', // Se permite actualizar el perfil
                'title' => 'sometimes|required|string|max:255',
                'url' => 'sometimes|required|url|max:2048',
                'icon_class' => 'nullable|string|max:100',
                'order' => 'nullable|integer',
            ]);

            // 2. Lógica de negocio (Verificación de propiedad y actualización en el Service)
            $updatedLink = $this->linkService->updateLink($link, $request->all(), $request->user());

            if (!$updatedLink) {
                // 404 si el link no existe, o 403 si el link/perfil no pertenece al usuario
                return response()->json(['message' => 'Link no encontrado o no autorizado para modificar.'], 404);
            }

            return response()->json($updatedLink);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Los datos de la solicitud son inválidos.', 'errors' => $e->errors()], 422);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error al actualizar el link.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $link): JsonResponse
    {
        try {
            $deleted = $this->linkService->deleteLink($link, request()->user());

            if (!$deleted) {
                // 404 si el link no existe, o 403 si no es el dueño
                return response()->json(['message' => 'Link no encontrado o no autorizado para eliminar.'], 404);
            }

            return response()->json(null, 204); // 204 No Content

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error al eliminar el link.', 'error' => $e->getMessage()], 500);
        }
    }
}