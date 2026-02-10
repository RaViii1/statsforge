import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LolBanner() {
  return (      
            
            <div className="p-6 bg-orange-950/30 border border-orange-900/30 rounded-xl my-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Want to track your stats automatically?
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Sign in with your Riot Games account to sync your profile and get real-time match updates.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-orange-900/30"
                  >
                    Connect Riot Account
                  </Link>
                </div>
              </div>
            </div>)
}