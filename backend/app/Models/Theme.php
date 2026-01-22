<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Theme extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'preview_url',
        'primary_color',
        'secondary_color',
        'background_color',
        'is_custom',
        'user_id',
    ];

    /**
     * Los atributos que deben ser casteados.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_custom' => 'boolean',
    ];

    /**
     * La relación inversa con el usuario (solo para temas personalizados).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para obtener solo temas del sistema (no personalizados).
     */
    public function scopeSystem($query)
    {
        return $query->where('is_custom', false);
    }

    /**
     * Scope para obtener solo temas personalizados.
     */
    public function scopeCustom($query)
    {
        return $query->where('is_custom', true);
    }
}
