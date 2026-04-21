<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        foreach (['Manager', 'Developer', 'Accountant'] as $title) {
            Position::query()->updateOrCreate(['title' => $title], ['title' => $title]);
        }
    }
}
