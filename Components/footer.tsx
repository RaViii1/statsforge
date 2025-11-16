import { Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 py-12 px-6 bg-slate-950/50 dark:bg-black/90 dark:border-orange-700/50 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              <span className="text-xl font-bold text-white dark:text-orange-400">StatsForge</span>
            </div>
            <p className="text-slate-400 dark:text-gray-400 text-sm">
              Your ultimate gaming statistics and tracking companion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-orange-400">Product</h4>
            <ul className="space-y-2 text-slate-400 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-orange-400">Company</h4>
            <ul className="space-y-2 text-slate-400 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-orange-400">Support</h4>
            <ul className="space-y-2 text-slate-400 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-orange-500 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800/50 dark:border-orange-700/40 pt-8 text-center text-slate-400 dark:text-gray-400 text-sm">
          <p>© 2025 StatsForge. All rights reserved.</p>
                    <span className="text-center text-zinc-400 text-sm">
            StatsForge isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </span>
        </div>

      </div>
    </footer>
  );
}
