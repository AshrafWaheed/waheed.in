<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /** All users, newest first. */
    public function index(): JsonResponse
    {
        $users = User::query()->orderByDesc('created_at')->get()
            ->map(fn (User $u) => $this->payload($u));

        return response()->json(['data' => $users]);
    }

    /** Create an admin. Password optional — a random one is generated + returned once. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['nullable', 'string', 'min:12', 'max:255'],
        ]);

        $generated = ! isset($data['password']) || $data['password'] === '';
        $password = $generated
            ? Str::password(16, letters: true, numbers: true, symbols: true, spaces: false)
            : $data['password'];

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        return response()->json([
            'data' => $this->payload($user),
            'generated_password' => $generated ? $password : null,
        ], 201);
    }

    /** Edit a user's name / email. */
    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        if (array_key_exists('name', $data)) {
            $user->name = $data['name'];
        }
        if (array_key_exists('email', $data)) {
            $user->email = strtolower($data['email']);
        }
        $user->save();

        return response()->json(['data' => $this->payload($user)]);
    }

    /** Delete a user. Can't delete yourself or the last admin. */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            throw ValidationException::withMessages(['user' => ['You cannot delete your own account.']]);
        }
        if ($user->isAdmin() && User::where('role', 'admin')->count() <= 1) {
            throw ValidationException::withMessages(['user' => ['You cannot delete the last admin.']]);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    /** Reset a user's password (given or random) and log them out everywhere. */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'password' => ['nullable', 'string', 'min:12', 'max:255'],
        ]);

        $generated = ! isset($data['password']) || $data['password'] === '';
        $password = $generated
            ? Str::password(16, letters: true, numbers: true, symbols: true, spaces: false)
            : $data['password'];

        $user->forceFill(['password' => Hash::make($password)])->save();
        $user->tokens()->delete();

        return response()->json([
            'data' => $this->payload($user),
            'generated_password' => $generated ? $password : null,
        ]);
    }

    /** @return array<string, mixed> */
    private function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'last_login_at' => $user->last_login_at?->toIso8601String(),
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }
}
