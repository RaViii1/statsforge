"use client";

import { Gamepad2, Twitter, Github, Youtube, Mail, ArrowRight, Shield, Globe, Zap, Cpu, Anvil } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  games: [
    { name: "League of Legends", href: "/lol" },
    { name: "CS2", href: "/cs2" },
    { name: "Valorant", href: "/valorant" },
    { name: "Teamfight Tactics", href: "/tft" },
    { name: "Fortnite", href: "/fortnite" },
  ],
  // resources: [
  //   { name: "API Documentation", href: "#" },
  //   { name: "Community Guides", href: "#" },
  //   { name: "Pro Player Stats", href: "#" },
  //   { name: "Patch Notes", href: "#" },
  // ],
  // company: [
  //   { name: "About Us", href: "#" },
  //   { name: "Careers", href: "#" },
  //   { name: "Blog", href: "#" },
  //   { name: "Press Kit", href: "#" },
  // ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Status", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "Github" },
  { icon: Youtube, href: "#", label: "Youtube" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 pt-24 pb-12 overflow-hidden border-t border-zinc-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                <Anvil className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">StatsForge</span>
            </Link>
            
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              Elevate your competitive gaming experience with professional-grade analytics and real-time tracking across all major titles.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <Link 
                    key={i} 
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500/30 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-6">
                <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-zinc-400 hover:text-orange-500 transition-colors text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-orange-500 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="border-b border-zinc-900 mb-12">
            </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} StatsForge. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Terms of Service</Link>
            <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Cookie Settings</Link>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 rounded-xl bg-zinc-900/30 border border-zinc-900/50">
          <p className="text-[12px] text-slate-300 leading-relaxed text-center uppercase tracking-tighter opacity-60">
            StatsForge isn't endorsed by Riot Games, Valve, Epic Games or any game developer and doesn't reflect the views or opinions of these companies or anyone officially involved in producing or managing their properties. All associated properties are trademarks or registered trademarks of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
