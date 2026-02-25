<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'full_name' => $this->faker->name,
            'headline' => $this->faker->optional()->jobTitle(),
            'bio' => $this->faker->optional()->paragraph(),
            'email_public' => $this->faker->optional()->safeEmail(),
            'location' => $this->faker->optional()->city(),
            'profile_image_url' => null,
            'api_token' => null,
        ];
    }
}
