<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Profile Pictures Configuration
    |--------------------------------------------------------------------------
    |
    | Configuración específica para el manejo de imágenes de perfil
    | en la aplicación Link-in-Bio
    |
    */

    'profile_pictures' => [
        'disk' => env('PROFILE_PICTURES_DISK', 'public'),
        'path' => env('PROFILE_PICTURES_PATH', 'profile-pictures'),
        'max_size' => env('MAX_PROFILE_PICTURE_SIZE', 2048), // KB
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'resize' => [
            'width' => 500,
            'height' => 500,
            'quality' => 85,
        ],
        'thumbnails' => [
            'small' => [
                'width' => 150,
                'height' => 150,
                'quality' => 80,
            ],
            'medium' => [
                'width' => 300,
                'height' => 300,
                'quality' => 85,
            ],
        ],
    ],

    'uploads' => [
        'max_file_size' => env('MAX_UPLOAD_SIZE', 5120), // KB
        'allowed_types' => [
            'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            'documents' => ['pdf'],
        ],
        'scan_uploads' => env('SCAN_UPLOADS', false),
    ],

    'image_optimization' => [
        'enable_webp' => env('ENABLE_WEBP_CONVERSION', true),
        'auto_optimize' => env('AUTO_OPTIMIZE_IMAGES', true),
        'compression_quality' => env('IMAGE_COMPRESSION_QUALITY', 85),
    ],
];