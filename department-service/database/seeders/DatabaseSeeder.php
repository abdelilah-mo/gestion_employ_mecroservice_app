<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        foreach (['Human Resources', 'Engineering', 'Finance'] as $name) {
            Department::query()->updateOrCreate(['name' => $name], ['name' => $name]);
        }
    }
}
