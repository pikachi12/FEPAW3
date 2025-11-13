interface Project {
  id: number;
  title: string;
  status: string;
  description: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white">
      <p
        className={`text-sm font-semibold mb-2 ${
          project.status === "Available" ? "text-green-600" : "text-red-500"
        }`}
      >
        {project.status}
      </p>
      <h2 className="font-semibold text-lg mb-2">{project.title}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-4">
        {project.description}
      </p>
      <button className="bg-orange-500 text-white py-2 w-full rounded-md hover:bg-orange-600 transition">
        Read more
      </button>
    </div>
  );
}
