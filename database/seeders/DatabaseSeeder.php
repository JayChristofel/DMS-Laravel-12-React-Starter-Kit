<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\NotificationEmail;
use App\Models\Document;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            DummyDocumentSeeder::class,
        ]);
        
        User::factory(10)->create([
            'role' => 'user',
        ]);
    }
}
