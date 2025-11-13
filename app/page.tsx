"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import ProjectCard from "./components/ProjectCard";
import Pagination from "./components/Pagination";

interface Project {
  id: number;
  title: string;
  status: string;
  description: string;
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const projects: Project[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: "SmartWaste: IoT-Based Waste Management System for Urban Areas",
    status: i < 4 ? "Available" : "Not Available",
    description:
      "SmartWaste adalah sistem pengelolaan sampah berbasis IoT yang memungkinkan pemantauan volume sampah secara real-time melalui sensor ultrasonik pada tempat sampah kota. Data dikirim ke dashboard terpusat untuk mengoptimalkan jadwal pengangkutan dan rute truk sampah.",
  }));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>

      <Pagination />
    </main>
  );
}
