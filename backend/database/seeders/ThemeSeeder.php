<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            [
                'name' => 'Default',
                'preview_url' => null,
                'primary_color' => '#f97316',   // orange-500
                'secondary_color' => '#ec4899', // pink-500
                'background_color' => '#1f2937', // gray-800
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gradient Sunset',
                'preview_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
                'primary_color' => '#f59e0b',
                'secondary_color' => '#ef4444',
                'background_color' => '#1e293b',
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ocean Blue',
                'preview_url' => 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#06b6d4',
                'background_color' => '#0f172a',
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Forest Green',
                'preview_url' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
                'primary_color' => '#10b981',
                'secondary_color' => '#059669',
                'background_color' => '#064e3b',
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Purple Night',
                'preview_url' => 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
                'primary_color' => '#a855f7',
                'secondary_color' => '#8b5cf6',
                'background_color' => '#581c87',
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sunset Pink',
                'preview_url' => 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
                'primary_color' => '#ec4899',
                'secondary_color' => '#f472b6',
                'background_color' => '#831843',
                'is_custom' => false,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('themes')->insert($themes);
    }
}
