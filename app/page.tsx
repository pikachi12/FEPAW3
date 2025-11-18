"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import ProjectCard from "./components/ProjectCard";
import Pagination from "./components/Pagination";
import ProjectModal from "./components/ProjectModal";
import AutoRedirectHome from "./components/AutoRedirectHome";

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

export default function Page() {
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("terbaru");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [order, setOrder] = useState("desc"); // default terbaru

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm.trim() !== "") params.append("judul", searchTerm);
      if (selectedCategory !== "All") params.append("kategori", selectedCategory);
      if (selectedStatus !== "All") params.append("status", selectedStatus);
      params.append("sortBy", sortBy);
      params.append("order", order);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/capstones/search?${params.toString()}`
      );

      const data = await res.json();
      setProjects(mapProjects(data));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
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
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, order]);

  // Pagination logic
  const paginatedProjects = projects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <AutoRedirectHome />   {/* AUTO REDIRECT IF LOGGED IN */}
    
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}

          sortBy={sortBy}
          setSortBy={setSortBy}

          order={order}
          setOrder={setOrder}

          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {loading ? (
          <div className="max-w-6xl mx-auto px-4 py-20 text-center">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onReadMore={handleOpenModal}
              />
            ))}
          </section>
        )}

        <Pagination
          total={projects.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setPage(1); }}
        />

        {isModalOpen && selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={handleCloseModal} 
          />
        )}
      </main>
    </>
  );
}