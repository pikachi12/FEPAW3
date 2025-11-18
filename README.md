# Capstone Container

## Deskripsi Aplikasi

Capstone Container adalah aplikasi manajemen proyek capstone berbasis web yang memudahkan pengelolaan data tim, anggota, dosen pembimbing, dan proses pelaporan serta notifikasi. Aplikasi ini mendukung fitur administrasi, alumni, mahasiswa, dan otentikasi pengguna.

## Nama Kelompok dan Daftar Anggota

**Nama Kelompok:** Kelompok Tiga  
**Aplikasi:** Capstone Container

**Daftar Anggota Kelompok:**
- Hanifah Putri Ariani (22/504042/TK/55111) - Ketua
- Navika Berlianda Rihadatul'aisya (22/505243/TK/55277)
- Raudha Nur Hidayatullah Susanto (22/500044/TK/54789)
- Muhammad Haidar Syaafi' (23/521614/TK/57545)
- Syahrul Afif Tri Anggara (23/518266/TK/57027)

## Fitur Utama

1. **Centralized Capstone Repository**
	Menyediakan wadah terpusat untuk melihat project capstone terdahulu, lengkap dengan ringkasan, dosen pembimbing, dan tim terkait. Mahasiswa dapat menemukan referensi yang relevan dengan kebutuhan kelompok mereka.

2. **Project Continuation Request Flow**
	Mahasiswa dapat mengajukan permintaan untuk melanjutkan project alumni melalui alur struktur yang jelas. Setiap request disertai alasan, dan alumni dapat melihat detail tim sebelum memberi keputusan.

3. **Alumni Approval System**
	Alumni memiliki notification khusus untuk meninjau, menyetujui, atau menolak pengajuan kelanjutan project. Proses ini menjamin kelanjutan project sesuai perencanaan dan ekspektasi alumni selaku pemilik.

4. **Admin-Controlled Master Data**
	Admin memegang kendali penuh atas data mahasiswa, alumni, dosen, dan tim, memastikan seluruh informasi valid dan konsisten. Setiap perubahan data terpusat sehingga error dapat diminimalisir.

5. **Automated Project Availability Status**
	Setiap project otomatis berubah status menjadi Unavailable jika telah menerima tiga request aktif, untuk menjaga fairness bagi seluruh kelompok.

6. **Document Integration via Google Drive**
	Unggah proposal, laporan, dan dokumen terkait melalui integrasi Google Drive, memudahkan pengelolaan file tanpa beban penyimpanan server tambahan.

## Struktur Folder dan File

```
FEPAW3/
├── app/
│   ├── admin/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── page.tsx
│   ├── alumni/
│   │   ├── components/
│   │   ├── types/
│   │   ├── utils/
│   ├── authentication/
│   ├── components/
│   ├── mahasiswa/
│   │   ├── components/
│   ├── register/
│   ├── test/
│   ├── utils/
│   ├── config.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── frontend/
│   └── lib/
├── lib/
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── README.md
└── ...
```

## Teknologi yang Digunakan

- **Framework:** Next.js (React)
- **Bahasa:** TypeScript, JavaScript
- **UI:** Tailwind CSS, Headless UI, react-feather, lucide-react
- **State/Data:** React Hooks (`useState`, `useEffect`), SWR
- **Notifikasi:** react-hot-toast
- **Linting & Tipe:** ESLint, TypeScript
- **API:** Fetch API untuk komunikasi backend
- **Utility:** clsx, class-variance-authority, jwt-decode
- **Build Tools:** PostCSS, Autoprefixer

## Setup

1. **Clone repository**
	```bash
	git clone <repo-url>
	cd FEPAW3
	```

2. **Install dependencies**
	```bash
	npm install
	```

3. **Jalankan aplikasi (development)**
	```bash
	npm run dev
	```

4. **Build aplikasi (production)**
	```bash
	npm run build
	npm start
	```

5. **Linting (optional)**
	```bash
	npm run lint
	```

## URL Deploy

https://capstone-container.vercel.app/