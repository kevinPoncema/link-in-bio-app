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
        return response()->json($profiles);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        // Validación
        $request->validate([
            // Asegura que no exista otro perfil para este usuario
            'user_id' => ':profiles,user_id', 
            'main_title' => 'required|string|max:255',
            'slug' => 'required|string|unique:profiles|max:255',
            // ... otras validaciones
        ]);

        $data = $request->only('profile_picture_url', 'main_title', 'description', 'slug', 'theme_name');
        $data['user_id'] = $userId; // Asignar el ID del usuario autenticado
        
        $profile = $this->profileService->createProfile($data);

        return response()->json($profile, 201);
    }


    public function show(int $id): JsonResponse
    {
        // Este método usa el ID del recurso (perfil), no el ID del usuario
        $profile = $this->profileService->getProfileById($id);

        if (!$profile) {
            return response()->json(['message' => 'Perfil no encontrado.'], 404);
        }

        return response()->json($profile);
    }
  
    public function update(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $request->validate([
            'main_title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:profiles,slug,'.$userId.',user_id',
        ]);

        $data = $request->only('profile_picture_url', 'main_title', 'description', 'slug', 'theme_name');

        $profile = $this->profileService->updateProfileByUserId($userId, $data);

        if (!$profile) {
            return response()->json(['message' => 'Perfil no encontrado para actualizar.'], 404);
        }

        return response()->json($profile);
    }
    
    public function destroy(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $deleted = $this->profileService->deleteProfileByUserId($userId);

        if (!$deleted) {
            return response()->json(['message' => 'Perfil no encontrado para eliminar.'], 404);
        }

        // 204 No Content
        return response()->json(null, 204); 
    }
}