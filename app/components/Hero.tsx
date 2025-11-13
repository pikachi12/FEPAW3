export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 py-16 px-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">
          Discover Projects. Continue the Journey.
        </h1>
        <p className="text-gray-600 mb-6">
          Gain inspiration, reconnect with alumni, and collaborate to continue
          the legacy of innovative capstone projects.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="What type of innovation inspires you most?"
            className="w-full border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute right-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>
      <div className="flex-1">
        <img
          src="/projek.png"
          alt="Project"
          className="rounded-2xl shadow-md object-cover w-full h-64"
        />
      </div>
    </section>
  );
}
