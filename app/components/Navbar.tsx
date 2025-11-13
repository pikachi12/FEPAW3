import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center py-4 px-8 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="font-bold text-lg">CAPCON</div>
        <span className="text-sm text-gray-500">Capstone Container</span>
      </div>
      <div className="space-x-4">
         <Link href="/register">
         <button className="text-gray-700 hover:text-black">Register</button>
         </Link>
        
         <Link href="/login"><button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
          Login
        </button></Link>
        
      </div>
    </header>
  );
}
