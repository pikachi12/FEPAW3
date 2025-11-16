// File: lib/dummy-data.ts

// 1. Definisikan Tipe Data Project
export interface ProjectData {
  id: number;
  tema: string;
  namaTim: string;
  judul: string;
  status: 'Available' | 'Not Available';
  anggota: string[];
  dosenPembimbing: string;
  dokumen: string;
  abstrak: string;
  kataKunci: string;
  hasilGambar: string[];
}

// 2. Data Dummy Project
export const dummyProjectData: ProjectData[] = [
  { 
    id: 1, 
    tema: 'Pengolahan Sampah', 
    namaTim: 'F04', 
    judul: 'SmartWaste: IoT-Based Waste Management System for Urban Areas', 
    status: 'Available',
    anggota: ['Raika Aditya Pratama (Ketua)', 'Siti Nurhaliza', 'Dimas Fadilah', 'Intan Maharani'],
    dosenPembimbing: 'Dr. Budi Santoso, S.T., M.Eng.',
    dokumen: 'google.drive.com/...',
    abstrak: `Pengolahan sampah di kawasan perkotaan masih menjadi isu penting yang berdampak langsung terhadap kebersihan lingkungan dan kesehatan masyarakat. Sistem konvensional yang digunakan saat ini sering kali tidak efisien, karena pengangkutan sampah dilakukan tanpa memperhatikan kondisi aktual di lapangan. Hal ini menyebabkan terjadinya penumpukan sampah di beberapa titik, sementara tempat lain masih dalam kondisi kosong.
Dalam menjawab permasalahan tersebut, tim Capstone A-07 mengusulkan SmartWaste, sebuah sistem pengelolaan sampah berbasis Internet of Things (IoT) yang dirancang untuk memantau volume sampah secara real-time melalui sensor ultrasonik yang terpasang pada setiap tempat sampah. Data hasil pengukuran dikirimkan ke dashboard terpusat melalui jaringan nirkabel untuk dianalisis dan ditampilkan dalam bentuk visualisasi yang interaktif. Sistem ini juga menerapkan algoritma optimisasi rute guna membantu petugas kebersihan menentukan jalur pengangkutan yang paling efisien.
Dengan adanya SmartWaste, diharapkan proses pengelolaan sampah dapat dilakukan secara lebih efektif, efisien, dan berkelanjutan. Sistem ini tidak hanya membantu pengambil kebijakan dalam melakukan perencanaan, tetapi juga berkontribusi terhadap terciptanya lingkungan perkotaan yang bersih dan sehat.`,
    kataKunci: 'Pengelolaan Sampah, IoT, Sensor Ultrasonik, Dashboard, Optimasi Rute',
    hasilGambar: ['/project-image-1.jpg', '/project-image-2.jpg', '/project-image-3.jpg'],
  },
  { 
    id: 2, 
    tema: 'Pengolahan Sampah', 
    namaTim: 'F04', 
    judul: 'GreenCycle: AI-Powered Waste Sorting Robot', 
    status: 'Not Available',
    anggota: ['Agus Salim (Ketua)', 'Rina Wati', 'Eko Prasetyo'],
    dosenPembimbing: 'Prof. Dr. Ir. Rini Wijayanti, M.Sc.',
    dokumen: 'google.drive.com/...',
    abstrak: `Pemisahan sampah daur ulang secara manual di fasilitas pemrosesan masih lambat dan berisiko bagi pekerja. GreenCycle adalah robot pemilah sampah yang menggunakan Computer Vision dan AI untuk mengidentifikasi dan memisahkan berbagai jenis material (plastik, kertas, logam) secara otomatis.`,
    kataKunci: 'Daur Ulang, AI, Computer Vision, Robotika',
    hasilGambar: ['/project-image-4.jpg'],
  },
  // ... (Tambahkan data lain jika perlu, saya akan buat 13 lagi agar total 15)
  
];

// --- Team Data Types and Data ---
export interface AnggotaTim {
  nama: string;
  nimNip: string;
  programStudi: string;
}

export interface DosenPembimbing {
  nama: string;
  gelar: string;
  email: string;
}

export interface TeamData {
  id: number;
  tema: string;
  roleKetua: 'Mahasiswa' | 'Alumni';
  emailKetua: string;
  namaKetua: string;
  nimNipKetua: string;
  namaTim: string;
  judulProject?: string; // Judul proyek, bisa kosong
  tahun: number;
  anggota: AnggotaTim[];
  dosenPembimbing: DosenPembimbing;
  pengalamanTim?: string; // Bisa kosong
}

export const dummyTeamData: TeamData[] = [
  {
    id: 1,
    tema: 'Pengolahan Sampah',
    roleKetua: 'Mahasiswa',
    emailKetua: 'hanifahputriariani@mail.ugm.ac.id',
    namaKetua: 'Hanifah Putri Ariani',
    nimNipKetua: '22/504042/TK/55111',
    namaTim: 'F04',
    judulProject: 'SmartWaste: IoT-Based Waste Management System for Urban Areas',
    tahun: 2025,
    anggota: [
      { nama: 'Siti Nurhaliza', nimNip: '22/502341/TK/55321', programStudi: 'Teknik Biomedis' },
      { nama: 'Dimas Fadilah', nimNip: '22/503234/TK/55321', programStudi: 'Teknik Elektro' },
      { nama: 'Intan Maharani', nimNip: '22/512314/TK/54321', programStudi: 'Teknologi Informasi' },
    ],
    dosenPembimbing: {
      nama: 'Dr. Budi Santoso',
      gelar: 'S.T., M.Eng.',
      email: 'budi.santoso@ugm.ac.id'
    },
    pengalamanTim: 'Tim ini sebelumnya telah mengembangkan prototipe sistem pengelolaan limbah berbasis AI.'
  },
  {
    id: 2,
    tema: 'Kesehatan',
    roleKetua: 'Mahasiswa',
    emailKetua: 'raikaadityapratama@mail.ugm.ac.id',
    namaKetua: 'Raika Aditya Pratama',
    nimNipKetua: '22/512314/TK/54321',
    namaTim: 'F05',
    judulProject: 'Telemedicine Platform for Remote Areas',
    tahun: 2024,
    anggota: [
      { nama: 'Andi Pratama', nimNip: '22/501111/TK/55111', programStudi: 'Teknologi Informasi' },
      { nama: 'Budi Hartono', nimNip: '22/502222/TK/55222', programStudi: 'Teknik Elektro' },
    ],
    dosenPembimbing: {
      nama: 'Prof. Dr. Rina Wijayanti',
      gelar: 'S.T., M.Eng.',
      email: 'rina.wijayanti@ugm.ac.id'
    },
    pengalamanTim: 'Pengalaman dalam pengembangan aplikasi kesehatan mobile.'
  },
  
];