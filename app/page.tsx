"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Bell, Calendar, Shield, BarChart3, Target, 
  Eye, PieChart, Activity, Flame, ChevronRight, 
  Award, Trophy, Cpu, Zap, Box, User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

const featuredGames = [
  {
    title: "League of Legends",
    category: "MOBA",
    image: "/images/Ahri.webp",
    link: "/lol",
    accent: "orange"
    
  },
    {
    title: "TFT",
    category: "Auto Chess",
    image: "/images/pengu.webp",
    link: "/tft",
    accent: "green",
    Badge: true,
    BadgeText: "New"
  },
  {
    title: "CS2",
    category: "FPS",
    image: "/images/cs2.webp",
    link: "/cs2",
    accent: "orange",
    Badge: true,
    BadgeText: "Comming soon"
  },
  {
    title: "Valorant",
    category: "Tactical FPS",
    image: "/images/Valorant.webp",
    link: "/valorant",
    accent: "orange",
    Badge: true,
    BadgeText: "Comming soon"
  },
  {
    title: "Fortnite",
    category: "Battle Royale",
    image: "https://cdn2.unrealengine.com/fneco-38-00-companions-keyart-webcarousel-1920x1080-1920x1080-a97fa5de7bf8.jpg?resize=1&w=1920",
    link: "/fortnite",
    accent: "orange",
    Badge: true,
    BadgeText: "Comming soon"
  }
];

const features = [
  { 
    icon: TrendingUp, 
    title: "Real-time Metrics", 
    desc: "Precision tracking forged from live game data streams." 
  },
  { 
    icon: Bell, 
    title: "Pulse Notifications", 
    desc: "Instant alerts on meta shifts and patch deployments." 
  },
  { 
    icon: Calendar, 
    title: "Strategic Roadmap", 
    desc: "Dont misss upcomming games" 
  },
  { 
    icon: Shield, 
    title: "Encrypted Registry", 
    desc: "Industrial-grade security for your competitive identity." 
  }
];

const howItWorks = [
  {
    step: "01",
    title: "Initialize Connection",
    description: "Securely link your gaming credentials to our central processing unit.",
    icon: Zap
  },
  {
    step: "02",
    title: "Data Extraction",
    description: "Our proprietary engine mines raw match data for granular analysis.",
    icon: Cpu
  },
  {
    step: "03",
    title: "Refined Insight",
    description: "Receive high-fidelity AI recommendations to optimize your performance.",
    icon: Box
  }
];

const advancedFeatures = [
  {
    icon: PieChart,
    title: "Match History",
    description: "Deep dive into your recent games with detailed KDA, objectives, and performance trends."
  },
  {
    icon: Activity,
    title: "Live Game Tracking",
    description: "See who you're playing against in real-time with rank data and champion performance stats."
  },
  {
    icon: Target,
    title: "Multi Game support",
    description: "Analyze performance across multiple titles from a single dashboard."
  },
  {
    icon: BarChart3,
    title: "Ranked Stats",
    description: "Monitor your Solo/Duo and Flex queue rankings, LP gains, and win rates at a glance."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};



export default function Home() {
  const { user, userName } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 selection:bg-orange-500/30 font-sans">

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-full h-[80%] bg-orange-600/3 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] bg-orange-500/2 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <Navbar />

      <main className="relative z-10 overflow-x-hidden">
        <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-zinc-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
          
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.30]" style={{ backgroundImage: 'url(/images/herosection.jpg)' }} />
          
          <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">StatsForge</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                    Refine Your <br />
                    <span className="text-orange-500 italic">Precision.</span>
                  </h1>
                  <p className="max-w-xl text-lg text-zinc-500 font-medium leading-relaxed">
                    Industrial-grade match diagnostics and performance telemetry for competitive players. 
                    Monitor, analyze, and optimize your gameplay with raw data integration.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                  {!user ? (
                    <Link href="/register" className="group relative px-10 py-5 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
                      <span className="relative z-10 flex items-center gap-2">
                        Login Now<ChevronRight className="w-4 h-4" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 pr-8 py-4 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <User className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-white text-2xl font-bold uppercase tracking-wider">
                        Welcome, <span className="text-orange-500">{userName}</span>!
                      </span>
                    </div>
                  )}
                  <Link href="#games" className="group relative px-10 py-5 rounded-xl bg-white text-black hover:text-white font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 shadow-lg shadow-white/20">
                    <span className="relative z-10 flex items-center gap-2">
                      Games <ChevronRight className="w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <section id="games" className="py-32 relative bg-zinc-950/40">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-12 border-l-2 border-orange-500/50 pl-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-orange-500 font-black text-xs uppercase tracking-[0.5em]">
                  <Flame className="w-5 h-5" /> 
                  Active Processing
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Supported Titles</h2>
              </div>
              <p className="text-zinc-500 max-w-md text-lg font-light leading-relaxed italic">
                Our extraction algorithms are fine-tuned for the industry&apos;s most demanding competitive environments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {featuredGames.map((game, idx) => (
                <Link 
                  key={idx}
                  href={game.link}
                  className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-900 transition-all duration-700 hover:border-orange-500/40 hover:-translate-y-2"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover scale-110 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-1000 ease-out"
                  />
                    {game.Badge && (
                      <div className={`absolute top-4 right-4 px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest ${
                        game.accent === 'orange' ? 'border text-orange-500 bg-orange-900/50' : 
                        game.accent === 'green' ? 'border text-green-500 bg-green-800/50 ' : 
                        game.accent === 'blue' ? 'border text-blue-500 bg-blue-800/50' : 
                        'border text-orange-500 bg-zinc-900/80'
                      }`}>
                        {game.BadgeText}
                      </div>
                    )}


                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="absolute top-8 left-8 w-12 h-px bg-white/20 group-hover:w-20 group-hover:bg-orange-500 transition-all duration-700" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-orange-500 transition-colors">
                          {game.category}
                        </span>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                          {game.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">
                        Access Station <ChevronRight className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

          <section className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/2 rounded-full blur-[140px]" />
            
            <div className="container mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Advanced data analysis</h2>
                <div className="h-px w-32 bg-orange-500/50 mx-auto" />
                <p className="text-zinc-500 text-lg font-light italic tracking-wide">Smart, precise performance insights built for serious gamers.</p>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {advancedFeatures.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div 
                      key={idx}
                      className="group relative p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm hover:border-orange-500/20 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <Icon className="w-24 h-24" />
                      </div>
                      
                      <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:border-orange-500/40 transition-all duration-500">
                          <Icon className="w-7 h-7 text-orange-500" />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-orange-500 transition-colors">{feature.title}</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed font-light">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

        <section id="features" className="py-32 border-y border-zinc-900/50 bg-[#0c0c0e]">
          <div className="container mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1px bg-zinc-900/50 border border-zinc-900/50 rounded-4xl overflow-hidden">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={idx}
                    className="p-12 bg-[#0c0c0e] hover:bg-zinc-900/20 transition-all group relative"
                  >
                    <div className="w-14 h-14 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center mb-8 group-hover:border-orange-500/30 transition-all">
                      <Icon className="w-7 h-7 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <h5 className="text-xl font-black text-white uppercase mb-4 tracking-tight leading-none">{feature.title}</h5>
                    <p className="text-zinc-500 text-sm leading-relaxed font-light italic">{feature.desc}</p>
                    
                    {/* Hover Glow */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works: The Production Line */}
        <section className="py-48 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-32 space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">The Production Line</h2>
              <p className="text-zinc-500 uppercase tracking-[0.5em] text-xs font-black">Industrial Optimization Sequence</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-24 relative">
              {/* Connector Pipeline */}
              <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-transparent via-zinc-800 to-transparent">
                <motion.div 
                  animate={{ left: ["0%", "90%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 w-32 h-full bg-orange-500/50 blur-sm"
                />
              </div>
              
              {howItWorks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.2, duration: 0.8 }}
                    className="relative text-center space-y-10 group"
                  >
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-32 h-32 rounded-4xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-orange-500/50 transition-all duration-700 group-hover:rotate-12">
                        <Icon className="w-12 h-12 text-orange-500" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center text-xl font-black border-4 border-[#09090b]">
                        {item.step}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                      <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xs mx-auto italic">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        
        <section className="py-48 relative overflow-hidden bg-zinc-950 border-t border-zinc-900 group/cta">
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
          
          <div className="container mx-auto px-6 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto text-center space-y-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                Secure Connection Required
              </div>
              
              <h2 className="text-5xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Ready for <br />
                <span className="text-orange-500 italic underline decoration-zinc-800 underline-offset-8">Processing?</span>
              </h2>
              
              <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed italic">
                Join the industrial network of competitive players using data-driven insights to refine their performance. No fluff, just raw telemetry.
              </p>
              
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="relative group px-12 py-6 rounded-xl bg-white text-black font-black uppercase tracking-widest text-lg transition-all hover:scale-105 hover:bg-orange-500 hover:text-white shadow-2xl overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Connect Account <ChevronRight className="w-5 h-5" />
                  </span>
                </Link>
                <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest vertical-rl hidden sm:block">
                  Auth_Required_v.01
                </div>
              </div>
            </motion.div>
          </div>

          
          <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-zinc-800" />
          <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-zinc-800" />
          <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-zinc-800" />
          <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-zinc-800" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

