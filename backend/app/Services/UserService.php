<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers(): Collection
    {
        try {
            return $this->userRepository->getAll();
        } catch (\Exception $e) {
            // Puedes loguear el error aquí si lo deseas
            throw $e;
        }
    }

    public function findUserById(int $id): ?User
    {
        try {
            return $this->userRepository->findById($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function searchUsersByName(string $name): Collection
    {
        try {
            return $this->userRepository->searchByName($name);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function createUser(array $data): User
    {
        try {
            $data['password'] = Hash::make($data['password']);
            return $this->userRepository->create($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function updateUser(int $id, array $data): bool
    {
        try {
            $user = $this->userRepository->findById($id);

            if (!$user) {
                return false;
            }
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            return $this->userRepository->update($user, $data);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function deleteUser(int $id): bool
    {
        try {
            $user = $this->userRepository->findById($id);

            if (!$user) {
                return false;
            }

            return $this->userRepository->delete($user);
        } catch (\Exception $e) {
            throw $e;
        }
    }



    public function attemptLogin(string $email, string $password): ?User
    {
        try {
            $user = $this->userRepository->findByEmail($email);

            if ($user && Hash::check($password, $user->password)) {
                return $user;
            }

            return null;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function registerUser(array $data): User
    {
        try {
            // En este caso, simplemente delegamos a createUser ya que maneja el hashing
            return $this->createUser($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}