'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { User, LogOut, ChevronDown, Shield, LayoutDashboard, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'


export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const { user, loading, userRole, userName, premium_user } = useAuth()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([])

  const isAdmin = userRole === 'admin'

  const menuItems = [
    { label: 'Profile', href: '/profile', icon: User },
    ...(isAdmin ? [{ label: 'Admin Panel', href: '/admin', icon: LayoutDashboard }] : []),
    { label: 'Sign Out', action: 'signout', icon: LogOut },
  ]

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        buttonRef.current?.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev < menuItems.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : menuItems.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0) {
          const item = menuItems[focusedIndex]
          if (item.action === 'signout') {
            handleSignOut()
          } else if (item.href) {
            router.push(item.href)
            setIsOpen(false)
            setFocusedIndex(-1)
          }
        }
        break
    }
  }, [isOpen, focusedIndex, menuItems])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  const handleSignOut = async () => {
    setIsOpen(false)
    setFocusedIndex(-1)
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully!')
    router.push('/')
    router.refresh()
  }

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.action === 'signout') {
      handleSignOut()
    } else {
      setIsOpen(false)
      setFocusedIndex(-1)
    }
  }

  if (loading) {
    return (
      <div
        className="w-9 h-9 rounded-xl bg-zinc-800/60 animate-pulse"
        aria-label="Loading user menu"
      />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2.5" role="navigation" aria-label="Authentication">
        <Link
          href="/login"
          className="px-4 py-2 text-zinc-400 hover:text-white text-[13px] font-medium transition-colors duration-200 rounded-lg hover:bg-white/5"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[13px] font-semibold
            transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30
            hover:-translate-y-px active:translate-y-0"
        >
          Get Started
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3" ref={menuRef}>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => {
            setIsOpen(!isOpen)
            setFocusedIndex(-1)
          }}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User menu"
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl
            bg-white/[0.04] hover:bg-white/[0.08]
            border border-white/6 hover:border-white/[0.12]
            backdrop-blur-sm
            transition-all duration-200 ease-out
            group"
        >
          {/* Avatar with gradient ring */}
          <div className="relative">
            <div className={`w-7 h-7 rounded-lg
              flex items-center justify-center
              shadow-lg
              transition-shadow duration-200
              ${premium_user
                ? 'bg-linear-to-br from-orange-700 to-amber-600 shadow-amber-500/20 group-hover:shadow-amber-500/30'
                : isAdmin
                  ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/20 group-hover:shadow-red-500/30'
                  : 'bg-linear-to-br from-orange-500 to-orange-600 shadow-orange-500/20 group-hover:shadow-orange-500/30'
              }`}>
              <User className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <span className={`text-[13px] font-medium hidden sm:block max-w-[100px] truncate transition-colors duration-200 ${
            isAdmin ? 'text-red-300 group-hover:text-red-200' : premium_user ? 'text-amber-300 group-hover:text-amber-200' : 'text-zinc-300 group-hover:text-white'
          }`}>
            {userName}
          </span>

          <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-all duration-200 ${
            isOpen ? 'rotate-180 text-orange-400' : 'group-hover:text-zinc-400'
          }`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              role="menu"
              aria-label="User menu options"
              className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden
                bg-zinc-900/80 backdrop-blur-xl
                border border-white/[0.08]
                shadow-2xl shadow-black/40
                z-[100]"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20">
                      <Shield className="w-2.5 h-2.5 text-red-400" />
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">ADMIN</span>
                    </span>
                  )}
                  {premium_user && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">PRO</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
              </div>

              {/* Menu items */}
              <div className="p-1.5" role="none">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isSignOut = item.action === 'signout'

                  if (isSignOut) {
                    return (
                      <button
                        key={item.label}
                        ref={el => { itemRefs.current[index] = el }}
                        onClick={() => handleItemClick(item)}
                        role="menuitem"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                          transition-all duration-150
                          ${focusedIndex === index
                            ? 'bg-red-500/10 text-red-400'
                            : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                      >
                        <Icon className="w-4 h-4 opacity-70" />
                        {item.label}
                      </button>
                    )
                  }

                  return (
                    <Link
                      key={item.label}
                      ref={el => { itemRefs.current[index] = el }}
                      href={item.href!}
                      onClick={() => handleItemClick(item)}
                      role="menuitem"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                        transition-all duration-150
                        ${focusedIndex === index
                          ? 'bg-white/[0.08] text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                        }`}
                    >
                      <Icon className="w-4 h-4 opacity-70" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
