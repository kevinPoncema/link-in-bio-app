<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Importa BelongsTo
use Illuminate\Database\Eloquent\Relations\HasMany; // Importa HasMany

class Profile extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'profile_picture_url',
        'main_title',
        'description',
        'slug',
        'theme_id',
    ];

    /**
     * La relación inversa con el usuario.
     * PROFILES tiene la FK user_id, por lo tanto, pertenece a un User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * La relación de uno a muchos con los enlaces.
     * PROFILES ||--o{ LINKS : includes
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function links(): HasMany
    {
        return $this->hasMany(Link::class);
    }

    /**
     * La relación con el tema.
     * PROFILES pertenece a un Theme.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }
}