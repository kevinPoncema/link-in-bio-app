<?php

namespace App\Http\Controllers;

use App\Services\ThemeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ThemeController extends Controller
{
    protected $themeService;

    public function __construct(ThemeService $themeService)
    {
        $this->themeService = $themeService;
    }

    /**
     * GET /api/themes
     * Obtener todos los temas
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Parámetro opcional para filtrar por tipo
            $filter = $request->query('filter', 'all');

            $themes = match($filter) {
                'system' => $this->themeService->getSystemThemes(),
                'user' => $this->themeService->getUserThemes(auth()->id()),
                default => $this->themeService->getAllThemes(),
            };

            return response()->json([
                'success' => true,
                'data' => $themes,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los temas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/themes
     * Crear un nuevo tema personalizado
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            
            // Si es un tema personalizado, asignar el usuario autenticado
            if (!isset($data['is_custom']) || $data['is_custom']) {
                $data['is_custom'] = true;
                $data['user_id'] = auth()->id();
            }

            $theme = $this->themeService->createTheme($data);

            return response()->json([
                'success' => true,
                'message' => 'Tema creado exitosamente',
                'data' => $theme,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tema',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/themes/{id}
     * Obtener un tema por ID
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $theme = $this->themeService->getThemeById($id);

            if (!$theme) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tema no encontrado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $theme,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el tema',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT/PATCH /api/themes/{id}
     * Actualizar un tema existente
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $theme = $this->themeService->updateTheme($id, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tema actualizado exitosamente',
                'data' => $theme,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el tema',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * DELETE /api/themes/{id}
     * Eliminar un tema
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->themeService->deleteTheme($id);

            return response()->json([
                'success' => true,
                'message' => 'Tema eliminado exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el tema',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
