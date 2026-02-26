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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email_public', 'netadmin@example.com')->first();
        if ($user) {
            if (!$user->username) {
                $user->update([
                    'username' => 'admin',
                    'password' => Hash::make('password'),
                ]);
            }
            return;
        }

        $user = User::create([
            'full_name' => 'Budi Santoso',
            'headline' => 'Network & System Administrator',
            'bio' => 'Ahli infrastruktur jaringan dan administrasi sistem dengan pengalaman 5+ tahun. Fokus pada perancangan jaringan, maintenance server (Linux/Windows), keamanan, monitoring, dan backup.',
            'email_public' => 'netadmin@example.com',
            'location' => 'Jakarta, Indonesia',
            'profile_image_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=netadmin',
            'username' => 'admin',
            'password' => Hash::make('password'),
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company_name' => 'PT Infrastruktur Nusantara',
            'position_title' => 'Senior Network & System Administrator',
            'location' => 'Jakarta',
            'start_date' => '2022-01-01',
            'end_date' => null,
            'is_current' => true,
            'description' => 'Mengelola infrastruktur jaringan dan server perusahaan. Maintenance firewall, VPN, DNS, DHCP; hardening Linux/Windows Server; monitoring dengan Zabbix; backup dan disaster recovery.',
        ]);

        Experience::create([
            'user_id' => $user->id,
            'company_name' => 'PT Teknologi Data Indonesia',
            'position_title' => 'Network Administrator',
            'location' => 'Bandung',
            'start_date' => '2019-06-01',
            'end_date' => '2021-12-31',
            'is_current' => false,
            'description' => 'Desain dan implementasi jaringan kantor, konfigurasi switch/router Cisco, manajemen VLAN, serta dukungan helpdesk infrastruktur.',
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
            'description' => 'Fokus pada jaringan komputer dan sistem informasi.',
        ]);

        $catNetworking = SkillCategory::create([
            'name' => 'Networking',
            'slug' => 'networking',
            'description' => 'Jaringan dan perangkat jaringan',
        ]);

        $catServer = SkillCategory::create([
            'name' => 'Server & OS',
            'slug' => 'server-os',
            'description' => 'Sistem operasi server',
        ]);

        $catSecurity = SkillCategory::create([
            'name' => 'Security',
            'slug' => 'security',
            'description' => 'Keamanan jaringan dan sistem',
        ]);

        $catMonitoring = SkillCategory::create([
            'name' => 'Monitoring & Automation',
            'slug' => 'monitoring-automation',
            'description' => 'Pemantauan dan otomasi infrastruktur',
        ]);

        $cisco = Skill::create([
            'skill_category_id' => $catNetworking->id,
            'name' => 'Cisco (Routing & Switching)',
            'slug' => 'cisco-routing-switching',
            'level' => 'Advanced',
            'description' => 'Konfigurasi router, switch, VLAN, ACL',
        ]);
        $firewall = Skill::create([
            'skill_category_id' => $catNetworking->id,
            'name' => 'Firewall (pfSense / iptables)',
            'slug' => 'firewall',
            'level' => 'Advanced',
            'description' => 'Rule firewall, NAT, VPN site-to-site',
        ]);
        $vpn = Skill::create([
            'skill_category_id' => $catNetworking->id,
            'name' => 'VPN',
            'slug' => 'vpn',
            'level' => 'Advanced',
            'description' => 'OpenVPN, WireGuard, IPsec',
        ]);
        $dns = Skill::create([
            'skill_category_id' => $catNetworking->id,
            'name' => 'DNS & DHCP',
            'slug' => 'dns-dhcp',
            'level' => 'Advanced',
            'description' => 'BIND, dnsmasq, Windows DNS/DHCP',
        ]);
        $linux = Skill::create([
            'skill_category_id' => $catServer->id,
            'name' => 'Linux (RHEL / Ubuntu Server)',
            'slug' => 'linux-server',
            'level' => 'Advanced',
            'description' => 'Administrasi, package, service, hardening',
        ]);
        $winServer = Skill::create([
            'skill_category_id' => $catServer->id,
            'name' => 'Windows Server',
            'slug' => 'windows-server',
            'level' => 'Intermediate',
            'description' => 'AD, DNS, DHCP, Group Policy, backup',
        ]);
        $bash = Skill::create([
            'skill_category_id' => $catMonitoring->id,
            'name' => 'Bash scripting',
            'slug' => 'bash',
            'level' => 'Advanced',
            'description' => 'Otomasi, cron, maintenance script',
        ]);
        $powershell = Skill::create([
            'skill_category_id' => $catMonitoring->id,
            'name' => 'PowerShell',
            'slug' => 'powershell',
            'level' => 'Intermediate',
            'description' => 'Otomasi Windows, administrasi jarak jauh',
        ]);
        $zabbix = Skill::create([
            'skill_category_id' => $catMonitoring->id,
            'name' => 'Zabbix / Nagios',
            'slug' => 'zabbix-nagios',
            'level' => 'Intermediate',
            'description' => 'Monitoring server, alerting, dashboard',
        ]);
        $backup = Skill::create([
            'skill_category_id' => $catSecurity->id,
            'name' => 'Backup & recovery',
            'slug' => 'backup-recovery',
            'level' => 'Advanced',
            'description' => 'Strategi backup, restore, disaster recovery',
        ]);

        UserSkill::create(['user_id' => $user->id, 'skill_id' => $cisco->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $linux->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $firewall->id, 'proficiency_level' => 4, 'years_experience' => 4, 'is_primary' => true]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $vpn->id, 'proficiency_level' => 4, 'years_experience' => 3, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $dns->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $winServer->id, 'proficiency_level' => 3, 'years_experience' => 3, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $bash->id, 'proficiency_level' => 4, 'years_experience' => 5, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $zabbix->id, 'proficiency_level' => 3, 'years_experience' => 3, 'is_primary' => false]);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $backup->id, 'proficiency_level' => 4, 'years_experience' => 4, 'is_primary' => false]);

        $proj1 = Project::create([
            'user_id' => $user->id,
            'title' => 'Migrasi Server ke Linux dan Konsolidasi Layanan',
            'slug' => 'migrasi-server-linux-konsolidasi',
            'summary' => 'Migrasi layanan dari Windows ke RHEL, konsolidasi DNS/DHCP dan backup terpusat.',
            'description' => 'Proyek migrasi 20+ server ke RHEL 8, konfigurasi BIND dan DHCP terpusat, serta implementasi strategi backup harian dengan retention 30 hari.',
            'url' => null,
            'repository_url' => null,
            'start_date' => '2024-06-01',
            'end_date' => '2024-12-31',
            'is_active' => false,
            'is_featured' => true,
        ]);

        $proj2 = Project::create([
            'user_id' => $user->id,
            'title' => 'Hardening Firewall dan Segmentasi VLAN',
            'slug' => 'hardening-firewall-vlan',
            'summary' => 'Desain ulang segmentasi jaringan dengan VLAN dan aturan firewall yang ketat.',
            'description' => 'Audit keamanan perimeter, implementasi pfSense dengan rule berbasis zona (DMZ, internal, guest), dan dokumentasi topologi VLAN.',
            'url' => null,
            'repository_url' => null,
            'start_date' => '2024-01-01',
            'end_date' => '2024-05-30',
            'is_active' => false,
            'is_featured' => true,
        ]);

        $proj3 = Project::create([
            'user_id' => $user->id,
            'title' => 'Deployment Zabbix untuk Monitoring Infrastruktur',
            'slug' => 'deployment-zabbix-monitoring',
            'summary' => 'Pemasangan Zabbix untuk pemantauan server, switch, dan layanan kritis.',
            'description' => 'Instalasi Zabbix server, konfigurasi template untuk Linux/Windows, integrasi notifikasi ke Telegram dan email, serta dashboard untuk tim operasi.',
            'url' => null,
            'repository_url' => null,
            'start_date' => '2023-08-01',
            'end_date' => '2023-12-31',
            'is_active' => false,
            'is_featured' => true,
        ]);

        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $linux->id]);
        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $dns->id]);
        ProjectSkill::create(['project_id' => $proj1->id, 'skill_id' => $backup->id]);
        ProjectSkill::create(['project_id' => $proj2->id, 'skill_id' => $firewall->id]);
        ProjectSkill::create(['project_id' => $proj2->id, 'skill_id' => $cisco->id]);
        ProjectSkill::create(['project_id' => $proj3->id, 'skill_id' => $zabbix->id]);
        ProjectSkill::create(['project_id' => $proj3->id, 'skill_id' => $bash->id]);

        $tagNetworking = Tag::create(['name' => 'Networking', 'slug' => 'networking']);
        $tagLinux = Tag::create(['name' => 'Linux', 'slug' => 'linux']);
        $tagSecurity = Tag::create(['name' => 'Security', 'slug' => 'security']);
        $tagTips = Tag::create(['name' => 'Tips', 'slug' => 'tips']);

        $post1 = BlogPost::create([
            'user_id' => $user->id,
            'title' => 'Troubleshooting Koneksi VPN yang Putus-Putus',
            'slug' => 'troubleshooting-vpn-putus-putus',
            'excerpt' => 'Langkah sistematis memeriksa masalah VPN: MTU, timeout, firewall, dan log.',
            'content' => "VPN yang sering putus bisa disebabkan oleh MTU, kebijakan firewall, atau masalah routing.\n\n## Cek MTU\n\nPastikan MTU di sisi client dan server konsisten...\n\n## Cek firewall dan NAT\n\nRule yang memblokir keepalive atau fragmentasi perlu ditinjau...",
            'published_at' => Carbon::now()->subDays(5),
            'is_published' => true,
        ]);

        $post2 = BlogPost::create([
            'user_id' => $user->id,
            'title' => 'Best Practice Hardening Linux Server untuk Layanan Publik',
            'slug' => 'hardening-linux-server-layanan-publik',
            'excerpt' => 'Ringkasan konfigurasi keamanan dasar: SSH, firewall, update, dan audit.',
            'content' => "Server yang terpapar internet perlu hardening di level OS dan layanan.\n\nKita akan bahas: non-root login, key-based SSH, konfigurasi firewall (firewalld/ufw), dan jadwal update keamanan...",
            'published_at' => Carbon::now()->subDays(2),
            'is_published' => true,
        ]);

        PostTag::create(['blog_post_id' => $post1->id, 'tag_id' => $tagNetworking->id]);
        PostTag::create(['blog_post_id' => $post1->id, 'tag_id' => $tagTips->id]);
        PostTag::create(['blog_post_id' => $post2->id, 'tag_id' => $tagLinux->id]);
        PostTag::create(['blog_post_id' => $post2->id, 'tag_id' => $tagSecurity->id]);

        Certification::create([
            'user_id' => $user->id,
            'name' => 'Cisco Certified Network Associate (CCNA)',
            'issuer' => 'Cisco',
            'issue_date' => '2024-03-01',
            'expiration_date' => null,
            'credential_id' => 'CCNA-12345678',
            'credential_url' => 'https://www.cisco.com/c/en_us/training-events/certifications/associate/ccna.html',
            'description' => 'Routing dan switching, dasar jaringan Cisco.',
        ]);

        Certification::create([
            'user_id' => $user->id,
            'name' => 'Red Hat Certified Engineer (RHCE)',
            'issuer' => 'Red Hat',
            'issue_date' => '2023-08-15',
            'expiration_date' => null,
            'credential_id' => null,
            'credential_url' => null,
            'description' => 'Administrasi sistem Linux enterprise (RHEL).',
        ]);

        ContactMessage::create([
            'user_id' => $user->id,
            'name' => 'Ahmad Wijaya',
            'email' => 'ahmad@example.com',
            'subject' => 'Konsultasi infrastruktur jaringan',
            'message' => 'Halo, kami butuh konsultasi untuk desain jaringan kantor cabang baru. Apakah Anda bersedia untuk diskusi singkat?',
            'is_read' => true,
        ]);

        ContactMessage::create([
            'user_id' => $user->id,
            'name' => 'Siti Rahayu',
            'email' => 'siti@example.com',
            'subject' => 'Pertanyaan tentang sertifikasi dan pengalaman',
            'message' => 'Apakah Anda pernah menangani migrasi dari Windows Server ke Linux? Saya tertarik untuk tahu pendekatan yang Anda gunakan. Terima kasih.',
            'is_read' => false,
        ]);
    }
}
