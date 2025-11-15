"use client";

import { useState } from "react";
import NavbarMahasiswa from "./components/NavbarMahasiswa";
import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";
import ProjectModal from "../components/ProjectModal"

// <-- 2. UPDATE INTERFACE PROJECT (sesuai kebutuhan modal)
export interface Project {
  id: number;
  status: 'Available' | 'NotAvailable_Taken' | 'NotAvailable_Limit'; // Status lebih spesifik
  title: string;
  description: string;
  // --- Data tambahan untuk Modal ---
  category: string;
  teamMembers: string[];
  supervisors: string[];
  abstract: string;
  keywords: string[];
  takenBy: string | null;
}

// <-- 3. UPDATE DATA DUMMY (agar sesuai interface baru & screenshot)
const DUMMY_PROJECTS: Project[] = [
  {
    id: 1,
    status: 'Available', // <-- STATE 1: AVAILABLE
    title: 'SmartWaste: IoT-Based Waste Management System for Urban Areas',
    description: 'SmartWaste adalah sistem pengelolaan sampah berbasis IoT...',
    category: 'Pengolahan Sampah',
    teamMembers: ['Raja Abby P. I. Ksatria (Ketua)', 'Dimas Fadillah', 'Gina Fadillah'],
    supervisors: ['Dr. Puji Saesari, S.T., M.Eng.'],
    abstract: 'Permasalahan pengelolaan sampah di kawasan perkotaan masih menjadi isu penting...',
    keywords: ['IoT', 'Sensor Ultrasonik', 'Coordinat', 'Optimasi Rute'],
    takenBy: null,
  },
  {
    id: 2,
    status: 'NotAvailable_Taken', // <-- STATE 2: NOT AVAILABLE (TAKEN)
    title: 'Project Alpha: Analisis Data Big Query',
    description: 'Sistem analisis data untuk memproses jutaan request per detik.',
    category: 'Data Science',
    teamMembers: ['Tim FGA-202S'],
    supervisors: ['Dr. Budi Doremi, M.Kom.'],
    abstract: 'Abstrak untuk Project Alpha...',
    keywords: ['BigQuery', 'Data Analysis', 'GCP'],
    takenBy: 'tim [FGA-202S]', // Alasan
  },
  {
    id: 3,
    status: 'NotAvailable_Limit', // <-- STATE 3: NOT AVAILABLE (LIMIT)
    title: 'Project Beta: Aplikasi Mobile Kesehatan',
    description: 'Aplikasi mobile lintas platform untuk monitoring kesehatan pasien.',
    category: 'Mobile Development',
    teamMembers: ['(Belum ada tim)'],
    supervisors: ['Dr. Siti Aminah, M.T.'],
    abstract: 'Abstrak untuk Project Beta...',
    keywords: ['Flutter', 'Real-time', 'Kesehatan'],
    takenBy: null,
  },
  // ... tambahkan 9 proyek lainnya dengan status bervariasi
];

export default function HomeMahasiswaPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const projects = DUMMY_PROJECTS;

  return (
    <main className="min-h-screen bg-white">
      <NavbarMahasiswa />

      <Hero />

      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          // <-- 6. PASS FUNGSI HANDLER KE PROJECT CARD
          <ProjectCard 
            key={project.id} 
            project={project} 
            onReadMore={handleOpenModal} // <--- INI PENTING
          />
        ))}
      </section>

      <Pagination />

      {isModalOpen && selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal} 
        />
      )}
      
    </main>
  );
}
