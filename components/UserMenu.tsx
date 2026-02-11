'use client'

import { useState } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, userRole, userName } = useAuth()

  if (loading) return <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" /> 

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-4 py-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-900/30"
        >
          Get Started
        </Link>
      </div>
    )
  }

  return (
    <div className='flex flex-row items-center gap-4'>
      {userRole === 'admin' && (
        <Link 
          href="/admin" 
          className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:text-orange-100 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1"
        >
          Admin Panel
        </Link>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <User className="w-4 h-4 text-orange-500" />
          </div>
          <span className={`text-sm font-medium hidden sm:block max-w-[120px] truncate ${
            userRole === 'admin' ? 'text-red-500 font-semibold' : 'text-zinc-300 group-hover:text-white'
          }`}>
            {userName}
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-[100] p-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 mb-1 sm:hidden">
              <p className="text-sm text-zinc-300 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                signOut()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
