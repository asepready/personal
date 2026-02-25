<?php

namespace Tests;

use App\Models\User;
use Laravel\Lumen\Testing\DatabaseMigrations;

class ApiTest extends TestCase
{
    use DatabaseMigrations;

    private function userWithToken(): User
    {
        $user = User::factory()->create(['api_token' => \Illuminate\Support\Str::random(60)]);

        return $user;
    }

    private function authHeader(User $user): array
    {
        return ['Authorization' => 'Bearer ' . $user->api_token];
    }

    /** @test */
    public function base_endpoint_returns_app_version(): void
    {
        $this->get('/');
        $this->assertResponseStatus(200);
        $this->assertEquals($this->app->version(), $this->response->getContent());
    }

    /** @test */
    public function api_users_index_returns_200_and_standard_structure(): void
    {
        $this->get('/api/users');
        $this->assertResponseStatus(200);
        $body = $this->response->json();
        $this->assertArrayHasKey('data', $body);
        $this->assertArrayHasKey('message', $body);
        $this->assertArrayHasKey('errors', $body);
        $this->assertNull($body['errors']);
    }

    /** @test */
    public function api_users_show_returns_404_when_not_found(): void
    {
        $this->get('/api/users/99999');
        $this->assertResponseStatus(404);
        $body = $this->response->json();
        $this->assertArrayHasKey('message', $body);
        $this->assertNull($body['data']);
    }

    /** @test */
    public function api_users_store_returns_401_without_token(): void
    {
        $this->post('/api/users', ['full_name' => 'Test']);
        $this->assertResponseStatus(401);
        $body = $this->response->json();
        $this->assertArrayHasKey('message', $body);
        $this->assertNull($body['data']);
    }

    /** @test */
    public function api_users_store_creates_user_and_returns_201_with_token(): void
    {
        $user = $this->userWithToken();
        $payload = [
            'full_name' => 'Test User',
            'headline' => 'Developer',
            'bio' => 'A test bio',
        ];
        $this->post('/api/users', $payload, $this->authHeader($user));
        $this->assertResponseStatus(201);
        $body = $this->response->json();
        $this->assertArrayHasKey('data', $body);
        $this->assertEquals('Test User', $body['data']['full_name']);
        $this->assertEquals('User created successfully', $body['message']);
    }

    /** @test */
    public function api_users_store_returns_422_on_validation_failure(): void
    {
        $user = $this->userWithToken();
        $this->post('/api/users', ['full_name' => ''], $this->authHeader($user));
        $this->assertResponseStatus(422);
        $body = $this->response->json();
        $this->assertArrayHasKey('errors', $body);
        $this->assertNotNull($body['errors']);
    }

    /** @test */
    public function api_users_update_returns_404_when_not_found(): void
    {
        $user = $this->userWithToken();
        $this->put('/api/users/99999', ['full_name' => 'Updated'], $this->authHeader($user));
        $this->assertResponseStatus(404);
    }

    /** @test */
    public function api_users_destroy_returns_404_when_not_found(): void
    {
        $user = $this->userWithToken();
        $this->delete('/api/users/99999', [], $this->authHeader($user));
        $this->assertResponseStatus(404);
    }

    /** @test */
    public function api_experiences_index_returns_200_and_standard_structure(): void
    {
        $this->get('/api/experiences');
        $this->assertResponseStatus(200);
        $body = $this->response->json();
        $this->assertArrayHasKey('data', $body);
        $this->assertArrayHasKey('message', $body);
        $this->assertArrayHasKey('errors', $body);
    }

    /** @test */
    public function api_skills_index_returns_200(): void
    {
        $this->get('/api/skills');
        $this->assertResponseStatus(200);
    }

    /** @test */
    public function api_projects_index_returns_200(): void
    {
        $this->get('/api/projects');
        $this->assertResponseStatus(200);
    }

    /** @test */
    public function api_blog_posts_index_returns_200(): void
    {
        $this->get('/api/blog-posts');
        $this->assertResponseStatus(200);
    }

    /** @test */
    public function api_contact_messages_store_returns_401_without_token(): void
    {
        $user = User::factory()->create();
        $payload = [
            'user_id' => $user->id,
            'name' => 'John',
            'email' => 'john@example.com',
            'subject' => 'Hello',
            'message' => 'Test',
        ];
        $this->post('/api/contact-messages', $payload);
        $this->assertResponseStatus(401);
    }

    /** @test */
    public function api_contact_messages_store_accepts_valid_payload_with_token(): void
    {
        $owner = User::factory()->create();
        $user = $this->userWithToken();
        $payload = [
            'user_id' => $owner->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Hello',
            'message' => 'Test message body',
        ];
        $this->post('/api/contact-messages', $payload, $this->authHeader($user));
        $this->assertResponseStatus(201);
        $body = $this->response->json();
        $this->assertArrayHasKey('data', $body);
    }

    /** @test */
    public function api_contact_public_accepts_valid_payload_without_auth(): void
    {
        User::factory()->create(['full_name' => 'Owner']);
        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'subject' => 'Hi',
            'message' => 'Public contact message',
        ];
        $this->post('/api/contact', $payload);
        $this->assertResponseStatus(201);
        $body = $this->response->json();
        $this->assertArrayHasKey('data', $body);
        $this->assertEquals('Message sent successfully.', $body['message']);
    }

    /** @test */
    public function api_contact_public_returns_422_on_validation_failure(): void
    {
        User::factory()->create();
        $this->post('/api/contact', ['name' => '', 'email' => 'invalid', 'subject' => 'S', 'message' => 'M']);
        $this->assertResponseStatus(422);
        $body = $this->response->json();
        $this->assertArrayHasKey('errors', $body);
    }

    /** @test */
    public function api_contact_public_rate_limit_returns_429_after_exceeding_limit(): void
    {
        User::factory()->create();
        $payload = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'subject' => 'Subj',
            'message' => 'Msg',
        ];
        for ($i = 0; $i < 5; $i++) {
            $this->post('/api/contact', $payload);
            $this->assertResponseStatus(201);
        }
        $this->post('/api/contact', $payload);
        $this->assertResponseStatus(429);
        $body = $this->response->json();
        $this->assertArrayHasKey('message', $body);
    }
}
