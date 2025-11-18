import { Search } from "react-feather";

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function Hero({ searchTerm, setSearchTerm }: HeroProps) {
  return (
    <section className="w-full relative h-[340px] md:h-[440px] flex items-center justify-center">
      <img
        src="/projek.png"
        alt="Project"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
          Discover Projects. Continue the Journey.
        </h1>
        <p className="hidden md:block text-base md:text-lg text-gray-100 text-center mb-6 drop-shadow">
          Gain inspiration, reconnect with alumni, and collaborate to continue the legacy of innovative capstone projects.
        </p>
        <div className="relative w-full max-w-xl mx-auto">
          {/* Mobile input */}
          <input
            type="text"
            placeholder="Cari inovasi..."
            className="w-full border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-orange-500 bg-white md:hidden"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Desktop input */}
          <input
            type="text"
            placeholder="What type of innovation inspires you most?"
            className="w-full border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-orange-500 bg-white hidden md:block"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <Search size={20} className="text-gray-400" />
          </span>
        </div>
      </div>
    </section>
  );
}
