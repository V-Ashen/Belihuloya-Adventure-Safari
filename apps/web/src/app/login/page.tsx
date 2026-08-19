"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center relative font-sans">
      
      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/nequye6d/image/upload/v1786526848/r82q2n87z69w3eqlht9c.jpg" 
          alt="Safari Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#0b120c]/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0e1710] border border-[#18261a] p-8 md:p-10 rounded-sm shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase font-display tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[#a3b3a5] text-sm">Sign in to manage your expeditions.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-sm text-red-300 font-mono text-xs flex items-start gap-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                Email Address
              </label>
              <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316] transition-colors">
                <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white font-sans text-sm focus:outline-none w-full placeholder-[#647466]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316] transition-colors">
                <Lock className="w-4 h-4 text-[#f97316] shrink-0" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white font-mono text-sm focus:outline-none w-full placeholder-[#647466]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-8 rounded-sm bg-[#f97316] hover:bg-[#ea580c] text-[#0b120c] font-mono font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-3 mt-8 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-mono tracking-widest text-[#647466] uppercase">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#f97316] font-bold hover:text-white transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
