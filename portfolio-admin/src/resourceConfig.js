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
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'password', label: 'Password (kosongkan jika tidak diubah)', type: 'password' },
    ],
  },
  experiences: {
    endpoint: 'experiences',
    listFilters: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
      { key: 'company_name', label: 'Perusahaan' },
      { key: 'position_title', label: 'Posisi' },
      { key: 'start_date', label: 'Mulai' },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
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
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
      { key: 'institution_name', label: 'Institusi' },
      { key: 'degree', label: 'Gelar' },
      { key: 'field_of_study', label: 'Bidang' },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
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
      { key: 'skill_category_id', label: 'Kategori', type: 'selectRemote', optionsEndpoint: 'skill-categories', optionLabel: 'name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'skill_category_id', label: 'Kategori', displayRelation: { key: 'category', labelKey: 'name' } },
      { key: 'level', label: 'Level' },
    ],
    formFields: [
      { key: 'skill_category_id', label: 'Kategori', type: 'selectRemote', optionsEndpoint: 'skill-categories', optionLabel: 'name', optionValue: 'id', required: true },
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'level', label: 'Level', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  'user-skills': {
    endpoint: 'user-skills',
    listFilters: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
      { key: 'skill_id', label: 'Skill', type: 'selectRemote', optionsEndpoint: 'skills', optionLabel: 'name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
      { key: 'skill_id', label: 'Skill', displayRelation: { key: 'skill', labelKey: 'name' } },
      { key: 'proficiency_level', label: 'Level' },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
      { key: 'skill_id', label: 'Skill', type: 'selectRemote', optionsEndpoint: 'skills', optionLabel: 'name', optionValue: 'id', required: true },
      { key: 'proficiency_level', label: 'Level Kemahiran', type: 'text' },
      { key: 'years_experience', label: 'Tahun Pengalaman', type: 'number' },
      { key: 'is_primary', label: 'Utama', type: 'checkbox' },
    ],
  },
  projects: {
    endpoint: 'projects',
    listFilters: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Judul' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
      { key: 'is_featured', label: 'Unggulan' },
      { key: 'is_published', label: 'Status' },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
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
      { key: 'is_published', label: 'Dipublikasi', type: 'checkbox' },
      { key: 'published_at', label: 'Tanggal publikasi', type: 'datetime-local' },
    ],
  },
  'project-skills': {
    endpoint: 'project-skills',
    listFilters: [
      { key: 'project_id', label: 'Project', type: 'selectRemote', optionsEndpoint: 'projects', optionLabel: 'title', optionValue: 'id' },
      { key: 'skill_id', label: 'Skill', type: 'selectRemote', optionsEndpoint: 'skills', optionLabel: 'name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'project_id', label: 'Project', displayRelation: { key: 'project', labelKey: 'title' } },
      { key: 'skill_id', label: 'Skill', displayRelation: { key: 'skill', labelKey: 'name' } },
    ],
    formFields: [
      { key: 'project_id', label: 'Project', type: 'selectRemote', optionsEndpoint: 'projects', optionLabel: 'title', optionValue: 'id', required: true },
      { key: 'skill_id', label: 'Skill', type: 'selectRemote', optionsEndpoint: 'skills', optionLabel: 'name', optionValue: 'id', required: true },
    ],
  },
  'blog-posts': {
    endpoint: 'blog-posts',
    previewBaseUrl: import.meta.env.VITE_SITE_URL || '',
    previewSlugField: 'slug',
    previewPathPrefix: '/blog/',
    listFilters: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
      { key: 'is_published', label: 'Dipublikasi', type: 'select', options: [{ value: '', label: 'Semua' }, { value: '1', label: 'Ya' }, { value: '0', label: 'Tidak' }] },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Judul' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
      { key: 'is_published', label: 'Status' },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'excerpt', label: 'Kutipan', type: 'textarea' },
      { key: 'content', label: 'Konten', type: 'markdown', minHeight: 400 },
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
      { key: 'blog_post_id', label: 'Blog Post', type: 'selectRemote', optionsEndpoint: 'blog-posts', optionLabel: 'title', optionValue: 'id' },
      { key: 'tag_id', label: 'Tag', type: 'selectRemote', optionsEndpoint: 'tags', optionLabel: 'name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'blog_post_id', label: 'Post', displayRelation: { key: 'post', labelKey: 'title' } },
      { key: 'tag_id', label: 'Tag', displayRelation: { key: 'tag', labelKey: 'name' } },
    ],
    formFields: [
      { key: 'blog_post_id', label: 'Blog Post', type: 'selectRemote', optionsEndpoint: 'blog-posts', optionLabel: 'title', optionValue: 'id', required: true },
      { key: 'tag_id', label: 'Tag', type: 'selectRemote', optionsEndpoint: 'tags', optionLabel: 'name', optionValue: 'id', required: true },
    ],
  },
  certifications: {
    endpoint: 'certifications',
    listFilters: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
    ],
    listColumns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nama' },
      { key: 'issuer', label: 'Penerbit' },
      { key: 'user_id', label: 'User', displayRelation: { key: 'user', labelKey: 'full_name' } },
    ],
    formFields: [
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id', required: true },
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
      { key: 'user_id', label: 'User', type: 'selectRemote', optionsEndpoint: 'users', optionLabel: 'full_name', optionValue: 'id' },
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
