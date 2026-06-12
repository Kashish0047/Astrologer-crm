import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#04040c] flex flex-col relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Background ambient effects */}
      <div className="absolute top-[-25%] left-[-15%] w-[55%] h-[55%] rounded-full bg-indigo-950/25 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-950/20 blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-amber-950/10 blur-[120px] pointer-events-none" />

      {/* Subtle cosmic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_40%,transparent_100%)] pointer-events-none"></div>

      {/* Navbar */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between z-10 border-b border-white/5 bg-[#04040c]/70 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_18px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_28px_rgba(245,158,11,0.5)] transition-all duration-500 transform group-hover:rotate-12">
            <Moon className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-cinzel font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200">
            AstroManager
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isLogin ? (
            <>
              <span className="text-slate-500 text-sm hidden sm:block">Don't have an account?</span>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-slate-500 text-sm hidden sm:block">Already have an account?</span>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 z-10">
        <div className="w-full max-w-md fade-in">
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-16 h-16 mb-5 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                <Moon className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>
            <h1 className="font-cinzel text-3xl font-bold text-white tracking-wide mb-2">AstroManager</h1>
            <p className="text-slate-500 text-sm text-center">Professional CRM for Astrologers</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

