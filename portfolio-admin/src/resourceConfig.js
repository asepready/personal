export const resourceConfigs = {
  users: {
    endpoint: 'users',
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'full_name', label: 'Nama' },
      { key: 'headline', label: 'Headline' },
      { key: 'email_public', label: 'Email' },
    ],
    formFields: [
      { key: 'full_name', label: 'Nama Lengkap', type: 'text', required: true },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'email_public', label: 'Email Publik', type: 'email' },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'profile_image_url', label: 'URL Foto Profil', type: 'text' },
    ],
  },
  experiences: {
    endpoint: 'experiences',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'company_name', label: 'Perusahaan' },
      { key: 'position_title', label: 'Posisi' },
      { key: 'start_date', label: 'Mulai' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'company_name', label: 'Perusahaan', type: 'text', required: true },
      { key: 'position_title', label: 'Posisi', type: 'text', required: true },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'start_date', label: 'Tanggal Mulai', type: 'date' },
      { key: 'end_date', label: 'Tanggal Selesai', type: 'date' },
      { key: 'is_current', label: 'Masih Berjalan', type: 'checkbox' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  educations: {
    endpoint: 'educations',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'institution_name', label: 'Institusi' },
      { key: 'degree', label: 'Gelar' },
      { key: 'field_of_study', label: 'Bidang' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'institution_name', label: 'Institusi', type: 'text', required: true },
      { key: 'degree', label: 'Gelar', type: 'text', required: true },
      { key: 'field_of_study', label: 'Bidang', type: 'text' },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'start_date', label: 'Tanggal Mulai', type: 'date' },
      { key: 'end_date', label: 'Tanggal Selesai', type: 'date' },
      { key: 'is_current', label: 'Masih Berjalan', type: 'checkbox' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  'skill-categories': {
    endpoint: 'skill-categories',
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'slug', label: 'Slug' },
    ],
    formFields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  skills: {
    endpoint: 'skills',
    listFilters: [
      { key: 'skill_category_id', label: 'Kategori ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'skill_category_id', label: 'Kategori ID' },
      { key: 'level', label: 'Level' },
    ],
    formFields: [
      { key: 'skill_category_id', label: 'Kategori ID', type: 'number', required: true },
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'level', label: 'Level', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  'user-skills': {
    endpoint: 'user-skills',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
      { key: 'skill_id', label: 'Skill ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'user_id', label: 'User ID' },
      { key: 'skill_id', label: 'Skill ID' },
      { key: 'proficiency_level', label: 'Level' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'skill_id', label: 'Skill ID', type: 'number', required: true },
      { key: 'proficiency_level', label: 'Level Kemahiran', type: 'text' },
      { key: 'years_experience', label: 'Tahun Pengalaman', type: 'number' },
      { key: 'is_primary', label: 'Utama', type: 'checkbox' },
    ],
  },
  projects: {
    endpoint: 'projects',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Judul' },
      { key: 'user_id', label: 'User ID' },
      { key: 'is_featured', label: 'Unggulan' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'summary', label: 'Ringkasan', type: 'textarea' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'url', label: 'URL Demo', type: 'text' },
      { key: 'repository_url', label: 'URL Repo', type: 'text' },
      { key: 'start_date', label: 'Tanggal Mulai', type: 'date' },
      { key: 'end_date', label: 'Tanggal Selesai', type: 'date' },
      { key: 'is_active', label: 'Aktif', type: 'checkbox' },
      { key: 'is_featured', label: 'Unggulan', type: 'checkbox' },
    ],
  },
  'project-skills': {
    endpoint: 'project-skills',
    listFilters: [
      { key: 'project_id', label: 'Project ID', type: 'number' },
      { key: 'skill_id', label: 'Skill ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'project_id', label: 'Project ID' },
      { key: 'skill_id', label: 'Skill ID' },
    ],
    formFields: [
      { key: 'project_id', label: 'Project ID', type: 'number', required: true },
      { key: 'skill_id', label: 'Skill ID', type: 'number', required: true },
    ],
  },
  'blog-posts': {
    endpoint: 'blog-posts',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
      { key: 'is_published', label: 'Dipublikasi', type: 'select', options: [{ value: '', label: 'Semua' }, { value: '1', label: 'Ya' }, { value: '0', label: 'Tidak' }] },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Judul' },
      { key: 'user_id', label: 'User ID' },
      { key: 'is_published', label: 'Publikasi' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'excerpt', label: 'Kutipan', type: 'textarea' },
      { key: 'content', label: 'Konten', type: 'textarea' },
      { key: 'published_at', label: 'Tanggal Publikasi', type: 'datetime-local' },
      { key: 'is_published', label: 'Dipublikasi', type: 'checkbox' },
    ],
  },
  tags: {
    endpoint: 'tags',
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'slug', label: 'Slug' },
    ],
    formFields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  'post-tags': {
    endpoint: 'post-tags',
    listFilters: [
      { key: 'blog_post_id', label: 'Blog Post ID', type: 'number' },
      { key: 'tag_id', label: 'Tag ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'blog_post_id', label: 'Post ID' },
      { key: 'tag_id', label: 'Tag ID' },
    ],
    formFields: [
      { key: 'blog_post_id', label: 'Blog Post ID', type: 'number', required: true },
      { key: 'tag_id', label: 'Tag ID', type: 'number', required: true },
    ],
  },
  certifications: {
    endpoint: 'certifications',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'issuer', label: 'Penerbit' },
      { key: 'user_id', label: 'User ID' },
    ],
    formFields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'issuer', label: 'Penerbit', type: 'text' },
      { key: 'issue_date', label: 'Tanggal Terbit', type: 'date' },
      { key: 'expiration_date', label: 'Tanggal Kedaluwarsa', type: 'date' },
      { key: 'credential_id', label: 'ID Kredensial', type: 'text' },
      { key: 'credential_url', label: 'URL Kredensial', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  'contact-messages': {
    endpoint: 'contact-messages',
    listFilters: [
      { key: 'user_id', label: 'User ID', type: 'number' },
      { key: 'is_read', label: 'Dibaca', type: 'select', options: [{ value: '', label: 'Semua' }, { value: '1', label: 'Ya' }, { value: '0', label: 'Tidak' }] },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subjek' },
      { key: 'is_read', label: 'Dibaca' },
    ],
    formFields: [
      { key: 'is_read', label: 'Tandai Dibaca', type: 'checkbox' },
    ],
    createDisabled: true,
  },
};
