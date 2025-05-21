<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Hitung jumlah users total, aktif dan tidak aktif
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $inactiveUsers = User::where('status', 'inactive')->count();
        
        return Inertia::render('Admin/Dashboard', [
            'users' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => $inactiveUsers
            ],
            'activities' => 45, // Contoh data statis
            'serverUptime' => 98 // Contoh data statis
        ]);
    }
}
