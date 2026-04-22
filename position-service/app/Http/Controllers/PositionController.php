<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PositionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Position::query()
                ->orderBy('title')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePosition($request);
        $validated['base_salary'] = $validated['base_salary'] ?? 0;

        $position = Position::create($validated);

        return response()->json($position, 201);
    }

    public function show(Position $position): JsonResponse
    {
        return response()->json($position);
    }

    public function update(Request $request, Position $position): JsonResponse
    {
        $position->update($this->validatePosition($request, $position));

        return response()->json($position->fresh());
    }

    public function destroy(Position $position): JsonResponse
    {
        $position->delete();

        return response()->json([
            'message' => 'Position deleted successfully.',
        ]);
    }

    private function validatePosition(Request $request, ?Position $position = null): array
    {
        return $request->validate([
            'title' => [
                $position ? 'sometimes' : 'required',
                'string',
                'max:255',
                Rule::unique('positions', 'title')->ignore($position?->id),
            ],
            'base_salary' => [
                'sometimes',
                'numeric',
                'min:0',
            ],
        ]);
    }
}
