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
    $router->get('users', 'UserController@index');
    $router->get('users/{id}', 'UserController@show');

    // Experiences
    $router->get('experiences', 'ExperienceController@index');
    $router->get('experiences/{id}', 'ExperienceController@show');

    // Educations
    $router->get('educations', 'EducationController@index');
    $router->get('educations/{id}', 'EducationController@show');

    // Skill categories
    $router->get('skill-categories', 'SkillCategoryController@index');
    $router->get('skill-categories/{id}', 'SkillCategoryController@show');

    // Skills
    $router->get('skills', 'SkillController@index');
    $router->get('skills/{id}', 'SkillController@show');

    // User skills (pivot)
    $router->get('user-skills', 'UserSkillController@index');
    $router->get('user-skills/{id}', 'UserSkillController@show');

    // Projects
    $router->get('projects', 'ProjectController@index');
    $router->get('projects/{id}', 'ProjectController@show');

    // Project skills (pivot)
    $router->get('project-skills', 'ProjectSkillController@index');
    $router->get('project-skills/{id}', 'ProjectSkillController@show');

    // Blog posts
    $router->get('blog-posts', 'BlogPostController@index');
    $router->get('blog-posts/{id}', 'BlogPostController@show');

    // Tags
    $router->get('tags', 'TagController@index');
    $router->get('tags/{id}', 'TagController@show');

    // Post tags (pivot)
    $router->get('post-tags', 'PostTagController@index');
    $router->get('post-tags/{id}', 'PostTagController@show');

    // Certifications
    $router->get('certifications', 'CertificationController@index');
    $router->get('certifications/{id}', 'CertificationController@show');

    // Public contact form (no auth) - stricter limit applied below
});

// POST /api/contact with stricter rate limit (5/min)
$router->group(['prefix' => 'api', 'middleware' => 'throttle:5'], function () use ($router) {
    $router->post('contact', 'PublicContactController@store');
});

// POST /api/login (username + password, rate limit 10/min per IP)
$router->group(['prefix' => 'api', 'middleware' => 'throttle:10,1'], function () use ($router) {
    $router->post('login', 'LoginController@login');
});

/*
|--------------------------------------------------------------------------
| API Routes - Protected (auth required): mutating + contact-messages
|--------------------------------------------------------------------------
*/

$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
    // Users (mutate)
    $router->post('users', 'UserController@store');
    $router->put('users/{id}', 'UserController@update');
    $router->patch('users/{id}', 'UserController@update');
    $router->delete('users/{id}', 'UserController@destroy');

    // Experiences
    $router->post('experiences', 'ExperienceController@store');
    $router->put('experiences/{id}', 'ExperienceController@update');
    $router->patch('experiences/{id}', 'ExperienceController@update');
    $router->delete('experiences/{id}', 'ExperienceController@destroy');

    // Educations
    $router->post('educations', 'EducationController@store');
    $router->put('educations/{id}', 'EducationController@update');
    $router->patch('educations/{id}', 'EducationController@update');
    $router->delete('educations/{id}', 'EducationController@destroy');

    // Skill categories
    $router->post('skill-categories', 'SkillCategoryController@store');
    $router->put('skill-categories/{id}', 'SkillCategoryController@update');
    $router->patch('skill-categories/{id}', 'SkillCategoryController@update');
    $router->delete('skill-categories/{id}', 'SkillCategoryController@destroy');

    // Skills
    $router->post('skills', 'SkillController@store');
    $router->put('skills/{id}', 'SkillController@update');
    $router->patch('skills/{id}', 'SkillController@update');
    $router->delete('skills/{id}', 'SkillController@destroy');

    // User skills (pivot)
    $router->post('user-skills', 'UserSkillController@store');
    $router->put('user-skills/{id}', 'UserSkillController@update');
    $router->patch('user-skills/{id}', 'UserSkillController@update');
    $router->delete('user-skills/{id}', 'UserSkillController@destroy');

    // Projects
    $router->post('projects', 'ProjectController@store');
    $router->put('projects/{id}', 'ProjectController@update');
    $router->patch('projects/{id}', 'ProjectController@update');
    $router->delete('projects/{id}', 'ProjectController@destroy');

    // Project skills (pivot)
    $router->post('project-skills', 'ProjectSkillController@store');
    $router->put('project-skills/{id}', 'ProjectSkillController@update');
    $router->patch('project-skills/{id}', 'ProjectSkillController@update');
    $router->delete('project-skills/{id}', 'ProjectSkillController@destroy');

    // Blog posts
    $router->post('blog-posts', 'BlogPostController@store');
    $router->put('blog-posts/{id}', 'BlogPostController@update');
    $router->patch('blog-posts/{id}', 'BlogPostController@update');
    $router->delete('blog-posts/{id}', 'BlogPostController@destroy');

    // Tags
    $router->post('tags', 'TagController@store');
    $router->put('tags/{id}', 'TagController@update');
    $router->patch('tags/{id}', 'TagController@update');
    $router->delete('tags/{id}', 'TagController@destroy');

    // Post tags (pivot)
    $router->post('post-tags', 'PostTagController@store');
    $router->put('post-tags/{id}', 'PostTagController@update');
    $router->patch('post-tags/{id}', 'PostTagController@update');
    $router->delete('post-tags/{id}', 'PostTagController@destroy');

    // Certifications
    $router->post('certifications', 'CertificationController@store');
    $router->put('certifications/{id}', 'CertificationController@update');
    $router->patch('certifications/{id}', 'CertificationController@update');
    $router->delete('certifications/{id}', 'CertificationController@destroy');

    // Contact messages (admin only: list, show, create, update, delete)
    $router->get('contact-messages', 'ContactMessageController@index');
    $router->get('contact-messages/{id}', 'ContactMessageController@show');
    $router->post('contact-messages', 'ContactMessageController@store');
    $router->put('contact-messages/{id}', 'ContactMessageController@update');
    $router->patch('contact-messages/{id}', 'ContactMessageController@update');
    $router->delete('contact-messages/{id}', 'ContactMessageController@destroy');
});
