<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'email_verified_at', 'created_at', 'role', 'status')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'role' => $user->role ?? 'user',
                    'status' => $user->status,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,user',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active', // Default status untuk user baru
        ]);

        // Kembalikan user yang baru dibuat dengan format yang sama dengan index
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
            ],
            'message' => 'User Created Successfully.'
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:admin,user',
            'status' => 'required|string|in:active,inactive',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
        ]);

        // Kembalikan user yang diperbarui
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
            ],
            'message' => 'User Updated Successfully.'
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        // Cek jika pengguna mencoba menghapus dirinya sendiri
        if ($user->id === $request->user()->id) {
            return response()->json([
                'error' => 'You cannot delete your own account.'
            ], 403);
        }

        $userId = $user->id; // Simpan ID user sebelum dihapus
        $user->delete();

        // Kembalikan ID user yang dihapus
        return response()->json([
            'userId' => $userId,
            'message' => 'User Deleted Successfully.'
        ]);
    }
} 