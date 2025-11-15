import { Project } from '@/app/page';

interface ProjectCardProps {
  project: Project;
  onReadMore: (project: Project) => void; // Tipe data fungsi
}

export default function ProjectCard({ project, onReadMore }: ProjectCardProps) {
  const isAvailable = project.status === "Available";

  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <p
          className={`text-sm font-semibold mb-2 ${
            isAvailable ? "text-green-600" : "text-red-500"
          }`}
        >
          {/* Tampilkan status 'Available' atau 'Not Available' saja di card */}
          {isAvailable ? "Available" : "Not Available"}
        </p>
        <h2 className="font-semibold text-lg mb-2">{project.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4">
          {project.description}
        </p>
      </div>
      
      {/* <-- 2. TAMBAHKAN 'onClick' PADA BUTTON --> */}
      <button 
        className="bg-orange-500 text-white py-2 w-full rounded-md hover:bg-orange-600 transition mt-4"
        onClick={() => onReadMore(project)} // <--- INI PENTING
      >
        Read more
      </button>
    </div>
  );
}
