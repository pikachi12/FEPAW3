"use client";

import { useEffect, useState } from "react";
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
  hasil: string[]; // URL gambar hasil (placeholder untuk sekarang)
  takenBy: {namaTim: string} | null;
}


export default function HomeMahasiswaPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("terbaru");

  const mapProjects = (data: any[]): Project[] => {
  return data.map((item: any) => ({
    id: item.id,
    title: item.judul,
    description: item.abstrak.slice(0, 120) + "...",
    category: item.kategori,
    teamMembers: [
      `${item.ketua.name} (Ketua)`,
      ...item.anggota.map((m: any) => m.name)
    ],
    supervisors: [item.dosen.name],
    abstract: item.abstrak,
    keywords: [],
    status:
      item.status === "Tersedia"
        ? "Available"
        : item.takenBy
        ? "NotAvailable_Taken"
        : "NotAvailable_Limit",
    hasil: item.hasil || [],
    takenBy: item.takenBy ? item.takenBy.namaTim : null,
    }));
  };

  const fetchProjects = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capstones`);
    const data = await res.json();
    const mapped = mapProjects(data);
    setProjects(mapped);

    // Ambil kategori unik
    const uniqueCategories = Array.from(new Set(mapped.map((p) => p.category)));
    setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const params = new URLSearchParams();

      if (searchTerm.trim() !== "") params.append("judul", searchTerm);
      if (selectedCategory !== "All") params.append("kategori", selectedCategory);
      if (selectedStatus !== "All") params.append("status", selectedStatus);
      params.append("sortBy", sortBy);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/capstones/search?${params.toString()}`
      );

      const data = await res.json();
      setProjects(mapProjects(data));
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

useEffect(() => {
  const timeout = setTimeout(() => {
    fetchSearchResults(); // karena search dan filter sama² pakai backend
  }, 100);

    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory, selectedStatus, sortBy]);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <NavbarMahasiswa />

      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <FilterBar
        categories={categories}
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
