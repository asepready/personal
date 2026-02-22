# Konfigurasi Terminal Cursor

Cursor memakai pengaturan terminal yang sama dengan VS Code. File konfigurasi: **User settings** (`settings.json`).

---

## Lokasi settings.json (Windows)

```
%APPDATA%\Cursor\User\settings.json
```

Biasanya: `C:\Users\<User>\AppData\Roaming\Cursor\User\settings.json`.

Bisa juga dibuka lewat: **File → Preferences → Settings**, lalu klik ikon **Open Settings (JSON)** di kanan atas.

---

## Perintah yang dijalankan saat terminal dibuka

Saat Anda membuka panel Terminal di Cursor, IDE menjalankan sesuatu seperti:

```powershell
powershell.exe -noexit -command 'try { . "…\shellIntegration.ps1" } catch {}'
```

- **powershell.exe** — shell yang dipakai (bisa diubah ke cmd, Git Bash, WSL).
- **-noexit** — jendela tetap terbuka setelah script selesai.
- **shellIntegration.ps1** — script integrasi Cursor (status, fitur terminal). Jika gagal, terminal tetap berjalan.

Shell yang dipakai dan argumennya dikontrol oleh **terminal profile** (lihat di bawah).

---

## Pengaturan terminal penting

Semua setting di bawah masuk ke `settings.json` (key `terminal.integrated.*`).

### 1. Shell default (Windows)

Menentukan shell mana yang dipakai saat terminal baru dibuka.

```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

Nilai umum:

- `"PowerShell"` — PowerShell (biasa)
- `"Command Prompt"` — cmd.exe
- `"Git Bash"` — bila Git Bash terpasang
- Nama profil kustom yang Anda definisikan di `terminal.integrated.profiles.windows`

### 2. Profil terminal (Windows)

Mendefinisikan beberapa “jenis” terminal (PowerShell, cmd, Git Bash, WSL, atau kustom).

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": "C:\\Windows\\System32\\cmd.exe",
      "args": ["/K"],
      "icon": "terminal-cmd"
    },
    "Git Bash": {
      "path": "C:\\Program Files\\Git\\bin\\bash.exe",
      "icon": "terminal-bash"
    },
    "WSL": {
      "path": "C:\\Windows\\System32\\wsl.exe",
      "args": ["-d", "Ubuntu"],
      "icon": "terminal-linux"
    }
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

- **source**: `"PowerShell"` = deteksi otomatis PowerShell.
- **path**: path penuh ke executable.
- **args**: argumen saat menjalankan (mis. `-NoProfile` untuk PowerShell, `/K` untuk cmd).
- **icon**: ikon di dropdown terminal.

Anda bisa hanya menambah satu profil (mis. Git Bash atau WSL) lalu set `defaultProfile.windows` ke nama profil itu.

### 3. Tampilan & perilaku

| Setting | Contoh | Fungsi |
|--------|--------|--------|
| `terminal.integrated.fontSize` | `12` | Ukuran font di terminal |
| `terminal.integrated.fontFamily` | `"Consolas, monospace"` | Font terminal |
| `terminal.integrated.cursorStyle` | `"line"` | Gaya kursor (line / block) |
| `terminal.integrated.cursorBlinking` | `true` | Kursor berkedip |
| `terminal.integrated.scrollback` | `10000` | Jumlah baris scrollback |
| `terminal.integrated.inheritEnv` | `true` / `false` | Warisi env dari Cursor (Anda sudah pakai `false`) |

### 4. Working directory (folder saat terminal buka)

```json
{
  "terminal.integrated.cwd": "${workspaceFolder}"
}
```

`${workspaceFolder}` = root workspace yang dibuka. Bisa diganti path tetap kalau perlu.

---

## Cara mengubah konfigurasi

1. Buka **settings.json** (Ctrl+Shift+P → “Open User Settings (JSON)” atau lewat File → Preferences).
2. Tambah atau ubah key `terminal.integrated.*` (gabung dengan object JSON yang sudah ada; jangan sampai ada dua key yang sama).
3. Simpan. Sebagian besar perubahan langsung dipakai; untuk ganti default profile kadang perlu buka tab terminal baru.

Contoh minimal hanya ganti shell default ke Command Prompt:

```json
{
  "terminal.integrated.defaultProfile.windows": "Command Prompt"
}
```

Contoh pakai Git Bash (sesuaikan path bila beda):

```json
{
  "terminal.integrated.profiles.windows": {
    "Git Bash": {
      "path": "C:\\Program Files\\Git\\bin\\bash.exe",
      "icon": "terminal-bash"
    }
  },
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

---

## Memilih profil dari UI

Tanpa mengedit JSON, Anda bisa:

1. Buka Command Palette: **Ctrl+Shift+P**.
2. Ketik: **Terminal: Select Default Profile**.
3. Pilih shell yang ingin jadi default (PowerShell, Command Prompt, Git Bash, WSL, dll.).

Cursor akan menuliskan setting yang sesuai ke `settings.json` untuk Anda.

---

## Troubleshooting singkat

- **Terminal tidak mau buka** — Cek path di `terminal.integrated.profiles.windows` (path harus benar, escape backslash `\\` di JSON).
- **Ingin PowerShell 7 (pwsh)** — Buat profil dengan `"path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe"` (sesuaikan path instalasi) dan set sebagai default.
- **Environment tidak sesuai** — Cek `terminal.integrated.inheritEnv` (Anda pakai `false`; ubah ke `true` bila ingin mewarisi env dari Cursor).

Referensi resmi: [VS Code Terminal Profiles](https://code.visualstudio.com/docs/terminal/profiles).
