<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $employees = [
            [
                'name' => 'Alice Martin',
                'email' => 'alice.martin@example.com',
                'department_id' => 1,
                'position_id' => 1,
            ],
            [
                'name' => 'Bob Dubois',
                'email' => 'bob.dubois@example.com',
                'department_id' => 2,
                'position_id' => 2,
            ],
        ];

        foreach ($employees as $employee) {
            Employee::query()->updateOrCreate([
                'email' => $employee['email'],
            ], $employee);
        }
    }
}
