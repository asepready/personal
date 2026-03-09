<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

/*
|--------------------------------------------------------------------------
| API Documentation (OpenAPI 3 + Swagger UI)
|--------------------------------------------------------------------------
*/

$router->get('docs/openapi.yaml', function () {
    $path = base_path('public/docs/openapi.yaml');
    if (!is_file($path)) {
        return response('OpenAPI spec not found', 404);
    }
    return response(file_get_contents($path), 200, [
        'Content-Type' => 'application/x-yaml',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

$router->get('docs', function () {
    $path = base_path('public/docs/index.html');
    if (!is_file($path)) {
        return response('Docs not found', 404);
    }
    return response(file_get_contents($path), 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]);
});

$router->get('docs/', function () {
    return redirect('/docs');
});

/*
|--------------------------------------------------------------------------
| API Routes - Public (no auth): GET only + POST /api/contact
|--------------------------------------------------------------------------
*/

$router->group(['prefix' => 'api', 'middleware' => 'throttle:60'], function () use ($router) {
    // Users (public read)
    $router->get('users', 'Api\UserController@index');
    $router->get('users/{id}', 'Api\UserController@show');

    // Experiences
    $router->get('experiences', 'Api\ExperienceController@index');
    $router->get('experiences/{id}', 'Api\ExperienceController@show');

    // Educations
    $router->get('educations', 'Api\EducationController@index');
    $router->get('educations/{id}', 'Api\EducationController@show');

    // Skill categories
    $router->get('skill-categories', 'Api\SkillCategoryController@index');
    $router->get('skill-categories/{id}', 'Api\SkillCategoryController@show');

    // Skills
    $router->get('skills', 'Api\SkillController@index');
    $router->get('skills/{id}', 'Api\SkillController@show');

    // User skills (pivot)
    $router->get('user-skills', 'Api\UserSkillController@index');
    $router->get('user-skills/{id}', 'Api\UserSkillController@show');

    // Projects
    $router->get('projects', 'Api\ProjectController@index');
    $router->get('projects/{id}', 'Api\ProjectController@show');

    // Project skills (pivot)
    $router->get('project-skills', 'Api\ProjectSkillController@index');
    $router->get('project-skills/{id}', 'Api\ProjectSkillController@show');

    // Blog posts
    $router->get('blog-posts', 'Api\BlogPostController@index');
    $router->get('blog-posts/{id}', 'Api\BlogPostController@show');

    // Tags
    $router->get('tags', 'Api\TagController@index');
    $router->get('tags/{id}', 'Api\TagController@show');

    // Post tags (pivot)
    $router->get('post-tags', 'Api\PostTagController@index');
    $router->get('post-tags/{id}', 'Api\PostTagController@show');

    // Certifications
    $router->get('certifications', 'Api\CertificationController@index');
    $router->get('certifications/{id}', 'Api\CertificationController@show');

    // Public contact form (no auth) - stricter limit applied below
});

// POST /api/contact with stricter rate limit (5/min)
$router->group(['prefix' => 'api', 'middleware' => 'throttle:5'], function () use ($router) {
    $router->post('contact', 'Api\PublicContactController@store');
});

// POST /api/login (username + password, rate limit 10/min per IP)
$router->group(['prefix' => 'api', 'middleware' => 'throttle:10,1'], function () use ($router) {
    $router->post('login', 'Api\LoginController@login');
});

/*
|--------------------------------------------------------------------------
| API Routes - Protected (auth required): mutating + contact-messages
|--------------------------------------------------------------------------
*/

$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
    // Users (mutate)
    $router->post('users', 'Api\UserController@store');
    $router->put('users/{id}', 'Api\UserController@update');
    $router->patch('users/{id}', 'Api\UserController@update');
    $router->delete('users/{id}', 'Api\UserController@destroy');

    // Experiences
    $router->post('experiences', 'Api\ExperienceController@store');
    $router->put('experiences/{id}', 'Api\ExperienceController@update');
    $router->patch('experiences/{id}', 'Api\ExperienceController@update');
    $router->delete('experiences/{id}', 'Api\ExperienceController@destroy');

    // Educations
    $router->post('educations', 'Api\EducationController@store');
    $router->put('educations/{id}', 'Api\EducationController@update');
    $router->patch('educations/{id}', 'Api\EducationController@update');
    $router->delete('educations/{id}', 'Api\EducationController@destroy');

    // Skill categories
    $router->post('skill-categories', 'Api\SkillCategoryController@store');
    $router->put('skill-categories/{id}', 'Api\SkillCategoryController@update');
    $router->patch('skill-categories/{id}', 'Api\SkillCategoryController@update');
    $router->delete('skill-categories/{id}', 'Api\SkillCategoryController@destroy');

    // Skills
    $router->post('skills', 'Api\SkillController@store');
    $router->put('skills/{id}', 'Api\SkillController@update');
    $router->patch('skills/{id}', 'Api\SkillController@update');
    $router->delete('skills/{id}', 'Api\SkillController@destroy');

    // User skills (pivot)
    $router->post('user-skills', 'Api\UserSkillController@store');
    $router->put('user-skills/{id}', 'Api\UserSkillController@update');
    $router->patch('user-skills/{id}', 'Api\UserSkillController@update');
    $router->delete('user-skills/{id}', 'Api\UserSkillController@destroy');

    // Projects
    $router->post('projects', 'Api\ProjectController@store');
    $router->put('projects/{id}', 'Api\ProjectController@update');
    $router->patch('projects/{id}', 'Api\ProjectController@update');
    $router->delete('projects/{id}', 'Api\ProjectController@destroy');

    // Project skills (pivot)
    $router->post('project-skills', 'Api\ProjectSkillController@store');
    $router->put('project-skills/{id}', 'Api\ProjectSkillController@update');
    $router->patch('project-skills/{id}', 'Api\ProjectSkillController@update');
    $router->delete('project-skills/{id}', 'Api\ProjectSkillController@destroy');

    // Blog posts
    $router->post('blog-posts', 'Api\BlogPostController@store');
    $router->put('blog-posts/{id}', 'Api\BlogPostController@update');
    $router->patch('blog-posts/{id}', 'Api\BlogPostController@update');
    $router->delete('blog-posts/{id}', 'Api\BlogPostController@destroy');

    // Tags
    $router->post('tags', 'Api\TagController@store');
    $router->put('tags/{id}', 'Api\TagController@update');
    $router->patch('tags/{id}', 'Api\TagController@update');
    $router->delete('tags/{id}', 'Api\TagController@destroy');

    // Post tags (pivot)
    $router->post('post-tags', 'Api\PostTagController@store');
    $router->put('post-tags/{id}', 'Api\PostTagController@update');
    $router->patch('post-tags/{id}', 'Api\PostTagController@update');
    $router->delete('post-tags/{id}', 'Api\PostTagController@destroy');

    // Certifications
    $router->post('certifications', 'Api\CertificationController@store');
    $router->put('certifications/{id}', 'Api\CertificationController@update');
    $router->patch('certifications/{id}', 'Api\CertificationController@update');
    $router->delete('certifications/{id}', 'Api\CertificationController@destroy');

    // Contact messages (admin only: list, show, create, update, delete)
    $router->get('contact-messages', 'Api\ContactMessageController@index');
    $router->get('contact-messages/{id}', 'Api\ContactMessageController@show');
    $router->post('contact-messages', 'Api\ContactMessageController@store');
    $router->put('contact-messages/{id}', 'Api\ContactMessageController@update');
    $router->patch('contact-messages/{id}', 'Api\ContactMessageController@update');
    $router->delete('contact-messages/{id}', 'Api\ContactMessageController@destroy');
});
