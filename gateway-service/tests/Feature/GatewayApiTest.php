<?php

namespace Tests\Feature;

use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GatewayApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Http::preventStrayRequests();

        config([
            'services.auth_service.url' => 'http://auth-service.test',
            'services.department_service.url' => 'http://department-service.test',
        ]);
    }

    public function test_auth_service_login_endpoint_returns_a_token(): void
    {
        Http::fake([
            'http://auth-service.test/api/login' => Http::response([
                'token' => 'test-token',
            ], 200),
        ]);

        $response = Http::acceptJson()
            ->post(rtrim(config('services.auth_service.url'), '/').'/api/login', [
                'email' => 'admin@example.com',
                'password' => 'secret',
            ]);

        $this->assertSame(200, $response->status());
        $this->assertSame('test-token', $response->json('token'));

        Http::assertSent(function (ClientRequest $request): bool {
            return $request->method() === 'POST'
                && $request->url() === 'http://auth-service.test/api/login';
        });
    }

    public function test_departments_route_forwards_the_bearer_token(): void
    {
        $token = 'test-token';

        Http::fake([
            'http://auth-service.test/api/user' => Http::response([
                'id' => 1,
                'role' => 'user',
            ], 200),
            'http://department-service.test/api/departments*' => Http::response([
                ['id' => 10, 'name' => 'IT'],
            ], 200),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/departments?search=it');

        $response->assertOk()
            ->assertJson([
                ['id' => 10, 'name' => 'IT'],
            ]);

        Http::assertSentCount(2);

        Http::assertSent(function (ClientRequest $request) use ($token): bool {
            return $request->url() === 'http://auth-service.test/api/user'
                && $request->hasHeader('Authorization', 'Bearer '.$token)
                && $request->hasHeader('Accept', 'application/json');
        });

        Http::assertSent(function (ClientRequest $request) use ($token): bool {
            return $request->url() === 'http://department-service.test/api/departments?search=it'
                && $request->hasHeader('Authorization', 'Bearer '.$token)
                && $request->hasHeader('Accept', 'application/json');
        });
    }

    public function test_departments_route_requires_a_bearer_token(): void
    {
        Http::fake();

        $response = $this->getJson('/api/departments');

        $response->assertUnauthorized()
            ->assertJson([
                'message' => 'Authorization token is required.',
            ]);

        Http::assertNothingSent();
    }

    public function test_auth_service_unexpected_status_returns_bad_gateway_instead_of_false_unavailable(): void
    {
        Http::fake([
            'http://auth-service.test/api/user' => Http::response([
                'message' => 'Internal auth error',
            ], 500),
        ]);

        $response = $this->withHeader('Authorization', 'Bearer test-token')
            ->getJson('/api/departments');

        $response->assertStatus(502)
            ->assertJson([
                'message' => 'Authentication service error.',
            ]);
    }
}
