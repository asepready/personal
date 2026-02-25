<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Certification;
use App\Models\ContactMessage;
use App\Models\Education;
use App\Models\Experience;
use App\Models\PostTag;
use App\Models\Project;
use App\Models\ProjectSkill;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('email_public', 'ahmad.wijaya@example.com')->exists()) {
            return;
        }

        $user = User::create([
            'full_name' => 'Ahmad Wijaya',
            'headline' => 'Full Stack Developer & UI Enthusiast',
            'bio' => 'Saya seorang developer dengan pengalaman 5+ tahun di web development. Fokus pada React, Laravel, dan sistem yang scalable.',
            'email_public' => 'ahmad.wijaya@example.com',
            'location' => 'Jakarta, Indonesia',
            'profile_image_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=portfolio',
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company_name' => 'PT Teknologi Nusantara',
            'position_title' => 'Senior Web Developer',
            'location' => 'Jakarta',
            'start_date' => '2022-01-01',
            'end_date' => null,
            'is_current' => true,
            'description' => 'Mengembangkan aplikasi web enterprise dengan Laravel dan React. Memimpin tim kecil untuk fitur baru dan maintenance.',
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company_name' => 'Startup Digital Indonesia',
            'position_title' => 'Web Developer',
            'location' => 'Bandung',
            'start_date' => '2019-06-01',
            'end_date' => '2021-12-31',
            'is_current' => false,
            'description' => 'Membangun produk SaaS dari nol, integrasi payment gateway, dan API untuk mobile.',
        ]);

        Education::create([
            'user_id' => $user->id,
            'institution_name' => 'Universitas Indonesia',
            'degree' => 'S.Kom',
            'field_of_study' => 'Ilmu Komputer',
            'location' => 'Depok',
            'start_date' => '2015-08-01',
            'end_date' => '2019-06-30',
            'is_current' => false,
            'description' => 'Fokus pada software engineering dan basis data.',
        ]);

        $catBackend = SkillCategory::create([
            'name' => 'Backend',
            'slug' => 'backend',
            'description' => 'Teknologi server-side',
        ]);

        $catFrontend = SkillCategory::create([
            'name' => 'Frontend',
            'slug' => 'frontend',
            'description' => 'Teknologi client-side',
        ]);

        $catTools = SkillCategory::create([
            'name' => 'Tools & DevOps',
            'slug' => 'tools-devops',
            'description' => 'Alat pengembangan dan infrastruktur',
        ]);

        $php = Skill::create([
            'skill_category_id' => $catBackend->id,
            'name' => 'PHP',
            'slug' => 'php',
            'level' => 'Advanced',
            'description' => 'Laravel, Lumen',
        ]);
        $laravel = Skill::create([
            'skill_category_id' => $catBackend->id,
            'name' => 'Laravel',
            'slug' => 'laravel',
            'level' => 'Advanced',
            'description' => 'REST API, Eloquent',
        ]);
        $mysql = Skill::create([
            'skill_category_id' => $catBackend->id,
            'name' => 'MySQL',
            'slug' => 'mysql',
            'level' => 'Intermediate',
            'description' => 'Database relational',
        ]);
        $react = Skill::create([
            'skill_category_id' => $catFrontend->id,
            'name' => 'React',
            'slug' => 'react',
            'level' => 'Advanced',
            'description' => 'Hooks, React Router',
        ]);
        $js = Skill::create([
            'skill_category_id' => $catFrontend->id,
            'name' => 'JavaScript',
            'slug' => 'javascript',
            'level' => 'Advanced',
            'description' => 'ES6+, TypeScript dasar',
        ]);
        $git = Skill::create([
            'skill_category_id' => $catTools->id,
            'name' => 'Git',
            'slug' => 'git',
            'level' => 'Advanced',
            'description' => 'Version control, CI/CD',
        ]);

        UserSkill::create(['user_id' => $user->id, 'skill_id' => $php->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $laravel->id, 'proficiency_level' => 4, 'years_experience' => 4, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $mysql->id, 'proficiency_level' => 3, 'years_experience' => 5, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $react->id, 'proficiency_level' => 4, 'years_experience' => 3, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $js->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $git->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => false]);

        $proj1 = Project::create([
            'user_id' => $user->id,
            'title' => 'Portfolio API',
            'slug' => 'portfolio-api',
            'summary' => 'REST API untuk portfolio pribadi dengan Lumen, OpenAPI, dan MySQL.',
            'description' => 'API lengkap dengan resource users, experiences, projects, blog, contact messages. Dilengkapi dokumentasi Swagger dan unit test.',
            'url' => 'https://portfolio-api.example.com',
            'repository_url' => 'https://github.com/example/portfolio-api',
            'start_date' => '2025-01-01',
            'end_date' => null,
            'is_active' => true,
            'is_featured' => true,
        ]);

        $proj2 = Project::create([
            'user_id' => $user->id,
            'title' => 'Dashboard Admin React',
            'slug' => 'dashboard-admin-react',
            'summary' => 'Dashboard CRUD untuk mengelola konten portfolio.',
            'description' => 'Single-page app dengan React, Vite, dan integrasi ke Portfolio API. Filter, pagination, dan layout responsif.',
            'url' => null,
            'repository_url' => 'https://github.com/example/portfolio-admin',
            'start_date' => '2025-02-01',
            'end_date' => null,
            'is_active' => true,
            'is_featured' => true,
        ]);

        $proj3 = Project::create([
            'user_id' => $user->id,
            'title' => 'Situs Portfolio Pengunjung',
            'slug' => 'portfolio-web',
            'summary' => 'Situs publik portfolio dengan React dan Vite.',
            'description' => 'Halaman Home, Tentang, Pengalaman, Proyek, Blog, Sertifikasi, dan form Kontak. Konsumsi API portfolio.',
            'url' => 'https://portfolio.example.com',
            'repository_url' => null,
            'start_date' => '2025-02-10',
            'end_date' => null,
            'is_active' => true,
            'is_featured' => false,
        ]);

        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $php->id]);
        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $laravel->id]);
        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $mysql->id]);
        ProjectSkill::create(['project_id' => $proj2->id, 'skill_id' => $react->id]);
        ProjectSkill::create(['project_id' => $proj2->id, 'skill_id' => $js->id]);
        ProjectSkill::create(['project_id' => $proj3->id, 'skill_id' => $react->id]);
        ProjectSkill::create(['project_id' => $proj3->id, 'skill_id' => $js->id]);

        $tagLaravel = Tag::create(['name' => 'Laravel', 'slug' => 'laravel']);
        $tagReact = Tag::create(['name' => 'React', 'slug' => 'react']);
        $tagApi = Tag::create(['name' => 'API', 'slug' => 'api']);
        $tagTips = Tag::create(['name' => 'Tips', 'slug' => 'tips']);

        $post1 = BlogPost::create([
            'user_id' => $user->id,
            'title' => 'Memulai REST API dengan Lumen',
            'slug' => 'memulai-rest-api-dengan-lumen',
            'excerpt' => 'Panduan singkat membuat API dengan Lumen: routing, controller, dan response JSON.',
            'content' => "Lumen adalah micro-framework dari Laravel yang cocok untuk API. Dalam artikel ini kita akan setup project, definisikan route, dan mengembalikan response JSON yang konsisten.\n\n## Langkah 1\n\nInstall Lumen via Composer...\n\n## Langkah 2\n\nKonfigurasi database dan model Eloquent...",
            'published_at' => Carbon::now()->subDays(5),
            'is_published' => true,
        ]);

        $post2 = BlogPost::create([
            'user_id' => $user->id,
            'title' => 'React Hooks untuk Data Fetching',
            'slug' => 'react-hooks-untuk-data-fetching',
            'excerpt' => 'Gunakan useEffect dan useState untuk load data dari API dengan bersih.',
            'content' => "Data fetching di React dengan hooks membutuhkan perhatian pada cleanup dan state loading/error.\n\nKita akan lihat pola yang aman untuk cancel request saat unmount...",
            'published_at' => Carbon::now()->subDays(2),
            'is_published' => true,
        ]);

        PostTag::create(['blog_post_id' => $post1->id, 'tag_id' => $tagLaravel->id]);
        PostTag::create(['blog_post_id' => $post1->id, 'tag_id' => $tagApi->id]);
        PostTag::create(['blog_post_id' => $post2->id, 'tag_id' => $tagReact->id]);
        PostTag::create(['blog_post_id' => $post2->id, 'tag_id' => $tagTips->id]);

        Certification::create([
            'user_id' => $user->id,
            'name' => 'AWS Certified Cloud Practitioner',
            'issuer' => 'Amazon Web Services',
            'issue_date' => '2024-03-01',
            'expiration_date' => null,
            'credential_id' => 'AWS-CCP-12345',
            'credential_url' => 'https://aws.amazon.com/certification/',
            'description' => 'Dasar-dasar cloud AWS.',
        ]);

        Certification::create([
            'user_id' => $user->id,
            'name' => 'Professional Scrum Master I',
            'issuer' => 'Scrum.org',
            'issue_date' => '2023-08-15',
            'expiration_date' => null,
            'credential_id' => null,
            'credential_url' => null,
            'description' => 'Scrum framework dan praktik agile.',
        ]);

        ContactMessage::create([
            'user_id' => $user->id,
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'subject' => 'Tawaran kerja sama proyek',
            'message' => 'Halo, saya tertarik untuk berkolaborasi pada proyek open source. Bagaimana cara terbaik untuk menghubungi Anda?',
            'is_read' => true,
        ]);

        ContactMessage::create([
            'user_id' => $user->id,
            'name' => 'Siti Rahayu',
            'email' => 'siti@example.com',
            'subject' => 'Pertanyaan tentang portfolio',
            'message' => 'Apakah Anda menerima proyek freelance untuk pembuatan website perusahaan? Terima kasih.',
            'is_read' => false,
        ]);
    }
}
