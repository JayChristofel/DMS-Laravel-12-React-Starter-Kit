<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display user dashboard
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('User/Dashboard');
    }
}
