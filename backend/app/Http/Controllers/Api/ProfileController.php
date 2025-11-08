<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    protected $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }


    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $profiles = $this->profileService->getProfilesByUserId($userId);
        if ($profiles->isEmpty()) {
            return response()->json(['message' => 'No se encontraron perfiles para este usuario.'], 404);
        }
        return response()->json($profiles, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        // Validación
        $request->validate([
            'main_title' => 'required|string|max:255',
            'slug' => 'required|string|unique:profiles|max:255',
            'description' => 'nullable|string',
            'profile_picture' => 'nullable|string', // Base64 string o archivo
            'theme_name' => 'nullable|string|max:50',
        ]);

        $data = $request->only('profile_picture', 'main_title', 'description', 'slug', 'theme_name');
        $data['user_id'] = $userId; // Asignar el ID del usuario autenticado
        
        $profile = $this->profileService->createProfile($data);

        return response()->json($profile, 201, [], JSON_UNESCAPED_SLASHES);
    }


    /**
     * Muestra un perfil específico por ID o slug.
     * Esta ruta es pública.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        // Este método usa el ID del recurso (perfil) o slug, no el ID del usuario
        $profile = $this->profileService->getProfileByIdOrSlug($id);

        if (!$profile) {
            return response()->json(['message' => 'Perfil no encontrado.'], 404);
        }

        return response()->json($profile, 200, [], JSON_UNESCAPED_SLASHES);
    }
  
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'main_title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:profiles,slug,'.$id,
            'profile_picture' => 'nullable|string', // Base64 string o archivo
        ]);

        $data = $request->only('profile_picture', 'main_title', 'description', 'slug', 'theme_name');

        $profile = $this->profileService->updateProfileById($id, $data);

        if (!$profile) {
            return response()->json(['message' => 'Perfil no encontrado para actualizar.'], 404);
        }

        return response()->json($profile, 200, [], JSON_UNESCAPED_SLASHES);
    }
    
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->profileService->deleteProfileById($id);

        if (!$deleted) {
            return response()->json(['message' => 'Perfil no encontrado para eliminar.'], 404);
        }

        // 204 No Content
        return response()->json(null, 204); 
    }
}