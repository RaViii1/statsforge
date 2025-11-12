"use client";
import { Search, TrendingUp, Bell, Gamepad2, Calendar, Anvil, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/Components/footer";
import Navbar from "@/Components/navbar";

const gameSplashArtUrls = {
  "League of Legends": "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
  "CS2": "/images/cs2.png",
  "Valorant": "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/e89ed4f29436931ec80e58d85def28cb1df0e8b1-3440x1020.png?auto=format&fit=fill&q=80&h=640",
  "Dota 2": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png",
  "Apex Legends": "https://example.com/apex-splash.jpg",
  "Fortnite": "https://cdn2.unrealengine.com/fneco-38-00-companions-keyart-webcarousel-1920x1080-1920x1080-a97fa5de7bf8.jpg?resize=1&w=1920",
  "Overwatch 2": "https://example.com/overwatch2-splash.jpg",
  "Call of Duty": "https://example.com/cod-splash.jpg",
};

const SERVERS = [
  { value: "europe", label: "EUNE" },
  { value: "euw1", label: "EUW" },
  { value: "na1", label: "NA" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
  { value: "la1", label: "LAN" },
  { value: "la2", label: "LAS" },
  { value: "oc1", label: "OCE" },
  { value: "ru", label: "RU" },
  { value: "tr1", label: "TR" },
  { value: "jp1", label: "JP" },
];

export default function Home() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("europe");
  const [tagLine, setTagLine] = useState("");
  const router = useRouter();

function sanitizeTagLine(tagLine: string) {
  return tagLine.replace(/[^a-zA-Z0-9]/g, '');
}

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const encodedUsername = encodeURIComponent(searchQuery.trim());
    const sanitizedTagLine = sanitizeTagLine(tagLine.trim());
    const encodedTagLine = encodeURIComponent(sanitizedTagLine);
    router.push(`/lol/profile/${selectedServer}/${encodedUsername}/${encodedTagLine}/`);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-950/30 border border-orange-900/30 rounded-full">
            <span className="text-orange-500 text-sm font-medium">Track Every Victory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight px-4">
            Your Ultimate
            <span className="block mt-2 text-orange-500">Gaming Stats Hub</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 px-4">
            Track your performance, discover game updates, and never miss a release across all your favorite games. One platform, unlimited possibilities.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 px-4">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
                {/* Server Selector */}
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all font-medium"
                >
                  {SERVERS.map((server) => (
                    <option key={server.value} value={server.value}>
                      {server.label}
                    </option>
                  ))}
                </select>

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <div className="flex flex-row gap-2 ">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter summoner name (e.g., Player)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all"
                  />
                  <input
                    type="text"
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    placeholder="Enter summoner tag (e.g., #0000)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all"
                  />
                  </div>

                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/40"
                >
                  Search
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-left">
                Search League of Legends players without logging in
              </p>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/40"
            >
              Start Tracking
            </Link>
          </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link
              href="api/lol/profile/eun1/Plovear/420"
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/40"
            >
              profile
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-24 px-4">
          {[{
            icon: TrendingUp,
            title: "Live Stats Tracking",
            description: "Real-time performance tracking across all your games with detailed analytics and insights.",
          }, {
            icon: Bell,
            title: "Game Updates",
            description: "Stay informed with instant notifications about patches, balance changes, and meta shifts.",
          }, {
            icon: Calendar,
            title: "Release Calendar",
            description: "Never miss a game launch or DLC release with our comprehensive gaming calendar.",
          }, {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is encrypted and protected. We never share your information with third parties.",
          }, {
            icon: Zap,
            title: "Lightning Fast",
            description: "Experience blazing fast load times and real-time updates without any lag or delays.",
          }, {
            icon: Gamepad2,
            title: "Multi-Game Support",
            description: "Track stats across hundreds of popular titles with unified performance metrics.",
          }].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 transition-all"
            >
              <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-900/30 transition-all">
                <Icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-zinc-400">{description}</p>
            </div>
          ))}
        </div>

        {/* Supported Games */}
        <div id="games" className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Supported Games</h2>
          <p className="text-zinc-400 mb-10">Track stats across hundreds of popular titles</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(gameSplashArtUrls).map(([game, splashUrl]) => (
              <div
                key={game}
                className="group relative p-6 rounded-xl cursor-pointer overflow-hidden border border-zinc-800 hover:border-orange-900/50 transition-all bg-zinc-900/50"
              >
                {/* Background image with overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundImage: `url(${splashUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-3 min-h-[120px] justify-center">
                  <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center group-hover:bg-orange-900/40 transition-all">
                    <Gamepad2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-white font-semibold text-center">{game}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
