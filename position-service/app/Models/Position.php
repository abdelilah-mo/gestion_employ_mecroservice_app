<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'title',
        'base_salary',
    ];

    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
        ];
    }
}
