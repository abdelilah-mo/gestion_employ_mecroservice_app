<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    protected $fillable = [
        'employee_id',
        'bonus',
        'total_salary',
    ];

    protected function casts(): array
    {
        return [
            'bonus' => 'decimal:2',
            'total_salary' => 'decimal:2',
        ];
    }
}
