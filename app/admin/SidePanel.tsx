// components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  Gamepad2,
  Puzzle,
  Users,
  Shield,
  ChevronDown,
  Layers,
  Box,
  Sparkles,
  UsersRound,
  Package,
  Zap,
  Crown,
  BarChart3,
  TrendingUp,
  PanelLeft,
  Settings,
  Anvil,
} from "lucide-react";

interface NavSection {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navSections: NavSection[] = [
//   {
//     label: "CS2",
//     icon: Swords,
//     children: [
//       { label: "Majors", href: "/admin/cs2/majors", icon: Crown },
//       { label: "Teams", href: "/admin/cs2/teams", icon: Users },
//       { label: "Matches", href: "/admin/cs2/matches", icon: BarChart3 },
//     ],
//   },
  {
    label: "LoL",
    icon: Gamepad2,
    children: [
      { label: "Items", href: "/admin/items-lol", icon: Package },
      { label: "Runes", href: "/admin/runes", icon: Zap },
      { label: "Arena Augments", href: "/admin/augments", icon: Sparkles },
      { label: "Champions", href: "/admin/champions-lol", icon: Swords },
      { label: "Spells", href: "/admin/summoner-spells", icon: Zap },
    ],
  },
  {
    label: "TFT",
    icon: Puzzle,
    children: [
      { label: "Sets", href: "/admin/sets", icon: Layers },
      { label: "Champions", href: "/admin/champions", icon: Users },
      { label: "Traits", href: "/admin/traits", icon: Shield },
      { label: "Items", href: "/admin/items", icon: Box },
      { label: "Comps", href: "/admin/team-comps", icon: UsersRound },
    ],
  },

];

function NavSectionItem({
  section,
  sidebarCollapsed,
}: {
  section: NavSection;
  sidebarCollapsed: boolean;
}) {
  const pathname = usePathname();
  const hasChildren = !!section.children && section.children.length > 0;
  const isActive = hasChildren
    ? section.children!.some(
        (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
      )
    : pathname === section.href;
  const [isOpen, setIsOpen] = useState(true);

  const Icon = section.icon;

  if (!hasChildren) {
    return (
      <Link
        href={section.href!}
        title={sidebarCollapsed ? section.label : undefined}
        className={`
          group flex items-center gap-3 px-3 py-3 rounded-[1rem] border transition-all duration-300
          ${sidebarCollapsed ? "justify-center" : ""}
          ${
            isActive
              ? "border-orange-500/20 bg-orange-500/5"
              : "border-transparent hover:border-orange-500/10 hover:bg-orange-500/[0.02]"
          }
        `}
      >
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0
            ${
              isActive
                ? "bg-orange-950/50 border border-orange-900/30"
                : "bg-zinc-900/80 border border-zinc-800 group-hover:bg-orange-950/30 group-hover:border-orange-900/30"
            }
          `}
        >
          <Icon
            className={`w-4 h-4 transition-colors duration-300 ${
              isActive
                ? "text-orange-500"
                : "text-zinc-500 group-hover:text-orange-500"
            }`}
          />
        </div>
        {!sidebarCollapsed && (
          <>
            <span
              className={`flex-1 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
              }`}
            >
              {section.label}
            </span>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
          </>
        )}
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => !sidebarCollapsed && setIsOpen(!isOpen)}
        title={sidebarCollapsed ? section.label : undefined}
        className={`
          group w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] border transition-all duration-300
          ${sidebarCollapsed ? "justify-center" : ""}
          ${
            isActive
              ? "border-orange-500/10 bg-orange-500/[0.02]"
              : "border-transparent hover:border-orange-500/10 hover:bg-orange-500/[0.02]"
          }
        `}
      >
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0
            ${
              isActive
                ? "bg-orange-950/50 border border-orange-900/30"
                : "bg-zinc-900/80 border border-zinc-800 group-hover:bg-orange-950/30 group-hover:border-orange-900/30"
            }
          `}
        >
          <Icon
            className={`w-4 h-4 transition-colors duration-300 ${
              isActive
                ? "text-orange-500"
                : "text-zinc-500 group-hover:text-orange-500"
            }`}
          />
        </div>
        {!sidebarCollapsed && (
          <>
            <span
              className={`flex-1 text-left text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
              }`}
            >
              {section.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-600 transition-all duration-300 ${
                isOpen ? "rotate-180 text-orange-500" : "group-hover:text-zinc-400"
              }`}
            />
          </>
        )}
      </button>

      {!sidebarCollapsed && (
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="pl-4 space-y-1 border-l border-zinc-800/50 ml-6">
            {section.children!.map((child) => {
              const childActive =
                pathname === child.href || pathname.startsWith(`${child.href}/`);
              const ChildIcon = child.icon;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`
                    group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden
                    ${childActive ? "bg-orange-500/5" : "hover:bg-orange-500/[0.02]"}
                  `}
                >
                  <div
                    className={`
                      absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 rounded-r-full bg-orange-500 transition-all duration-300
                      group-hover:h-4
                      ${childActive ? "h-4" : ""}
                    `}
                  />
                  <ChildIcon
                    className={`w-3.5 h-3.5 transition-colors duration-200 ml-1 ${
                      childActive
                        ? "text-orange-500"
                        : "text-zinc-600 group-hover:text-orange-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      childActive
                        ? "text-orange-400"
                        : "text-zinc-500 group-hover:text-orange-300"
                    }`}
                  >
                    {child.label}
                  </span>
                  {childActive && (
                    <div className="w-1 h-1 rounded-full bg-orange-500 ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`
          fixed z-10 top-24 transition-all duration-500
          ${sidebarCollapsed ? "left-[72px]" : "left-[264px]"}
          w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center
          hover:border-orange-500/30 hover:bg-zinc-800 transition-all duration-300 group
          shadow-lg shadow-black/20
        `}
      >
        <PanelLeft
          className={`w-4 h-4 text-zinc-500 group-hover:text-orange-500 transition-all duration-300 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      <aside
        className={`
          flex-shrink-0 border-r border-zinc-900 bg-zinc-950 relative transition-all duration-500 ease-in-out h-screen sticky top-0
          ${sidebarCollapsed ? "w-[88px]" : "w-[280px]"}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.03),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
            mixBlendMode: "overlay",
          }}
        />

        <div className="absolute top-0 left-6 w-10 h-px bg-white/10" />

        <div className="relative z-10 p-4 flex flex-col h-full">
          <div
            className={`flex items-center gap-3 mb-10 px-2 transition-all duration-500 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-orange-950/50 border border-orange-900/30 rounded-xl flex items-center justify-center shrink-0">
              <Anvil className="w-5 h-5 text-orange-500" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block">
                  Panel
                </span>
                <h2 className="text-sm font-black text-white uppercase tracking-tight">
                  Admin
                </h2>
              </div>
            )}
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
            {navSections.map((section) => (
              <NavSectionItem
                key={section.label}
                section={section}
                sidebarCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>

          <div className="mt-auto items-center flex flex-col">
                <span className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 whitespace-nowrap">
                 StatsForge
                </span>
          </div>
        </div>
      </aside>
    </>
  );
}