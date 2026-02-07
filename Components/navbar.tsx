"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";
import { Anvil } from "lucide-react";

import UserMenu from "./UserMenu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/90">
        <div className="max-w-7xl mx-auto pl-2 pr-2 sm:pl-3 sm:pr-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-8">
              <div className="w-9 h-9 bg-linear-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
                <Anvil className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-xl">StatsForge</span>
            </Link>

            {/* Links - Center (Desktop) */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <a
                href="#features"
                className="px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#games"
                className="px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
              >
                Games
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/50 bg-zinc-950">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Links */}
              <UserMenu />
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#games"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
              >
                Games
              </a>
           
              
            
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
