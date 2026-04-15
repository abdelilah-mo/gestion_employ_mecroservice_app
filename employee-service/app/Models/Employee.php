<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
    'name',
    'email',
    'department_id',
    'position_id'
];

    /*public function department()
    {
        return $this->belongsTo(Department::class);
    }*/
}
