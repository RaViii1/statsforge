import Link from 'next/link';
import { Anvil } from 'lucide-react';

    export default function Navbar() {
        return (
            <nav className="sticky border-b border-zinc-800/50 backdrop-blur-sm top-0 z-50 bg-zinc-950/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
                            <Anvil className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">StatsForge</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-white ">
                        <a href="#features" className="text-zinc-400 hover:text-orange-500 transition-colors font-medium">Features</a>
                        <a href="#games" className="text-zinc-400 hover:text-orange-500 transition-colors font-medium">Games</a>
                        <Link href="/login" className="px-6 py-2.5 text-zinc-300 hover:text-white font-semibold transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="px-6 py-2.5 text-white bg-orange-600 hover:bg-orange-700  rounded-lg font-semibold transition-all shadow-lg shadow-orange-900/30">
                            Get Started
                        </Link>
                    </div>      {/* Mobile menu button */}
          <button className="md:hidden p-2 text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>)
      }