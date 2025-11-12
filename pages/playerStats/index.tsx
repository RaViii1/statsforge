"use client";
import '../../app/globals.css' 
import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Anvil, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // const handleEmailLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const { data, error } = await authClient.signIn.email({
  //       email: formData.email,
  //       password: formData.password,
  //       rememberMe: formData.rememberMe,
  //     });

  //     if (error?.code) {
  //       toast.error("Invalid email or password. Please make sure you have registered an account and try again.");
  //       return;
  //     }

  //     toast.success("Login successful!");
  //     router.push("/");
  //     router.refresh();
  //   } catch (error) {
  //     toast.error("An error occurred during login");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleOAuthLogin = async (provider: "riot" | "epic" | "steam") => {
  //   setIsLoading(true);
  //   try {
  //     if (provider === "steam") {
  //       window.location.href = "/api/auth/steam";
  //       return;
  //     }

  //     await authClient.signIn.social({
  //       provider,
  //       callbackURL: "/",
  //     });
  //   } catch (error) {
  //     toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed`);
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
            <Anvil className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">StatsForge</span>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400 mb-6">Sign in to track your gaming stats</p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              // onClick={() => handleOAuthLogin("riot")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#D13639] hover:bg-[#B82E31] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-bold">RIOT</span>}
              <span>Sign in with Riot Games</span>
            </button>

            <button
              // onClick={() => handleOAuthLogin("steam")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#171A21] hover:bg-[#0E1116] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-bold">STEAM</span>}
              <span>Sign in with Steam</span>
            </button>

            <button
              // onClick={() => handleOAuthLogin("epic")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-zinc-900 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-bold">EPIC</span>}
              <span>Sign in with Epic Games</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900/50 text-zinc-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          {/* onSubmit={handleEmailLogin} */}
          <form  className="space-y-4"> 
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/50 transition-all"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/50 transition-all"
                  placeholder="••••••••"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded text-orange-600 focus:ring-orange-600/50"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-zinc-400">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
