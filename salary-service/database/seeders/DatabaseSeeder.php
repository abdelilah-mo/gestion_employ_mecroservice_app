<?php

namespace Database\Seeders;

use App\Models\Salary;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Salary::query()->updateOrCreate([
            'employee_id' => 1,
        ], [
            'amount' => 4200,
        ]);
    }
}
