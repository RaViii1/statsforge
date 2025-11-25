"use client";

import Image from "next/image";
import { Gamepad2, TrendingUp, Trophy, Users, Zap, Shield, Bell, Calendar, BarChart3, Target, Award, Eye, PieChart, Activity, Lock, Globe, Clock, Star } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

const featuredGames = [
  {
    title: "League of Legends",
    category: "MOBA",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
    link: "/lol"
  },
  {
    title: "CS2",
    category: "FPS",
    image: "/images/cs2.png",
    link: "/cs2"
  },
  {
    title: "Valorant",
    category: "Tactical FPS",
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/e89ed4f29436931ec80e58d85def28cb1df0e8b1-3440x1020.png?auto=format&fit=fill&q=80&h=640",
    link: "/valorant"
  },
  {
    title: "TFT",
    category: "Auto Chess",
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/12210015038f15148d157c5a4facdd8bd5cb5e78-1232x978.png?auto=format&fit=fill&q=80&w=720",
    link: "/tft"
  },
  {
    title: "Fortnite",
    category: "Battle Royale",
    image: "https://cdn2.unrealengine.com/fneco-38-00-companions-keyart-webcarousel-1920x1080-1920x1080-a97fa5de7bf8.jpg?resize=1&w=1920",
    link: "/fortnite"
  }

];

const features = [
  { 
    icon: TrendingUp, 
    title: "Live Stats Tracking", 
    desc: "Real-time performance analytics across all your games" 
  },
  { 
    icon: Bell, 
    title: "Game Updates", 
    desc: "Stay informed with instant patch and meta notifications" 
  },
  { 
    icon: Calendar, 
    title: "Release Calendar", 
    desc: "Never miss a game launch or DLC release date" 
  },
  { 
    icon: Shield, 
    title: "Secure & Private", 
    desc: "Your data is encrypted and never shared" 
  }
];

const statsShowcase = [
  { value: "10M+", label: "Active Players", icon: Users },
  { value: "500M+", label: "Matches Tracked", icon: BarChart3 },
  { value: "50+", label: "Supported Games", icon: Gamepad2 },
  { value: "99.9%", label: "Uptime", icon: Zap }
];

const howItWorks = [
  {
    step: "1",
    title: "Connect Your Account",
    description: "Link your gaming accounts securely in seconds",
    icon: Users
  },
  {
    step: "2",
    title: "Track Your Stats",
    description: "Automatic tracking of all your matches and performance",
    icon: Target
  },
  {
    step: "3",
    title: "Analyze & Improve",
    description: "Get insights and recommendations to level up your game",
    icon: TrendingUp
  }
];

const advancedFeatures = [
  {
    icon: PieChart,
    title: "Performance Analytics",
    description: "Deep dive into your gameplay with detailed charts, graphs, and trend analysis across all game modes"
  },
  {
    icon: Activity,
    title: "Match History",
    description: "Complete match replay system with frame-by-frame analysis and highlight detection"
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set personal performance goals and receive AI-powered recommendations to achieve them"
  },
  {
    icon: BarChart3,
    title: "Competitive Insights",
    description: "Compare your stats against players in your rank and identify areas for improvement"
  }
];



export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Subtle background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_120%,rgba(249,115,22,0.08),transparent_50%)]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-900/30 bg-orange-950/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-sm text-orange-500 font-medium">Track Every Victory</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                Your Ultimate
                <span className="block mt-2 text-orange-500">Gaming Stats Hub</span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400">
                Track your performance, discover game updates, and never miss a release across all your favorite games. One platform, unlimited possibilities.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group relative px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold overflow-hidden transition-all hover:scale-105">
                  <span className="relative z-10">Start Tracking</span>
                </button>
                <button className="px-8 py-4 rounded-xl border border-zinc-800 hover:border-orange-900/50 font-semibold text-white hover:bg-zinc-900 transition-all">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* Featured Games Section */}
        <section id="games" className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Supported Games</h2>
              <p className="text-zinc-400">Track your stats across the most popular competitive games</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game, idx) => (
                <Link 
                  key={idx}
                  href={game.link}
                  className="game-card group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-orange-900/50 transition-all"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Default dark linear */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                
                  {/* Orange hover linear */}
                  <div className="absolute inset-0 bg-linear-to-t from-orange-950/70 via-orange-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-sm border border-white/10 text-white">
                        {game.category}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white ">{game.title}</h3>
                      <div className="px-4 py-2 rounded-lg border border-orange-500 bg-orange-900/70 text-white font-medium text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Track {game.title} stats right now
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Analytics Section */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Advanced Analytics</h2>
              <p className="text-zinc-400">Professional-grade tools to analyze and improve your gameplay</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {advancedFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={idx}
                    className="group relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-orange-950/20 hover:border-orange-900/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-orange-950/50 border border-orange-900/30 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-900/50 transition-all">
                        <Icon className="w-7 h-7 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-white mb-2">{feature.title}</div>
                        <div className="text-sm text-zinc-400">{feature.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="relative py-20 bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Powerful Features</h2>
              <p className="text-zinc-400">Everything you need to dominate your games</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={idx}
                    className="group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-orange-950/30 hover:border-orange-900/50 transition-all"
                  >
                    <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-900/50 transition-all">
                      <Icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-xl font-semibold text-white mb-2">{feature.title}</div>
                    <div className="text-sm text-zinc-400">{feature.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="stats" className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-zinc-400">Get started in three simple steps</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative text-center">
                    {/* Connection Line */}
                    {idx < howItWorks.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-linear-to-r from-orange-500 to-transparent"></div>
                    )}
                    
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-orange-500 to-orange-600 mb-6">
                      <Icon className="w-10 h-10 text-white" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-900 border-2 border-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-500">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-zinc-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof / Trust Section */}
        <section className="relative py-20 bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <Eye className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Live Match Tracking</h3>
                <p className="text-zinc-400">Watch your stats update in real-time as you play. No manual entry required.</p>
              </div>
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <Award className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Rank Progress</h3>
                <p className="text-zinc-400">Track your competitive rank progression and see your improvement over time.</p>
              </div>
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <Trophy className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Achievement System</h3>
                <p className="text-zinc-400">Unlock milestones and celebrate your gaming accomplishments across titles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32">
          <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join millions of players tracking their stats and start your journey to improvement today.
            </p>
            <button className="px-10 py-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg hover:scale-105 transition-transform">
              Start Tracking Free
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}