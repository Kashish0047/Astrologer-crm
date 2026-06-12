import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Users, MessageSquare, ArrowRight, Star, Moon, Compass, Shield, Activity, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#04040c] flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Starry Glow Effects */}
      <div className="absolute top-[-30%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-950/20 blur-[180px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-950/15 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-amber-950/10 blur-[150px] pointer-events-none" />

      {/* Thin ambient cosmic grid or lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_40%,transparent_100%)] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="px-6 md:px-16 py-5 flex items-center justify-between z-20 border-b border-white/5 bg-[#04040c]/70 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-500 transform group-hover:rotate-12">
            <Moon className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-cinzel font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200">
            AstroManager
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <Button variant="primary" onClick={() => navigate('/dashboard')} className="group shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] transition-all duration-300">
              Go to Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white font-medium text-sm transition-colors tracking-wide px-3 py-2">
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10">
        <section className="px-6 md:px-12 pt-20 pb-28 text-center max-w-7xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-inner transform hover:scale-105 transition-transform duration-300">
            <Star className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>The Premier Astrology Practice Suite</span>
          </div>

          {/* Heading */}
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.08] max-w-6xl mb-8 drop-shadow-2xl">
            Align Your Practice with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-300 to-purple-400">
              Celestial Order
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed font-light mb-12">
            Elevate your consultations. A unified, luxury workspace designed for professional astrologers to track clients, automate scheduling, organize payments, and craft natal charts with <strong className="text-indigo-300 font-normal">AI-synthesized summaries</strong>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 w-full max-w-md">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500 text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {user ? 'Enter Dashboard' : 'Open Free Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>

          {/* Dashboard Premium Mockup Display */}
          <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-1.5 bg-gradient-to-b from-white/15 to-white/5 border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] group mt-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/0 to-amber-500/10 pointer-events-none z-10 rounded-3xl" />
            <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-slate-950">
              <img 
                src="/dashboard_mockup.png" 
                alt="AstroManager Premium Dashboard" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] select-none"
              />
            </div>
            {/* Ambient decorative border lights */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
          </div>
        </section>

        {/* Brand Philosophy Section */}
        <section className="py-20 border-t border-white/5 bg-[#060610]/40">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-3">
              <div className="text-amber-300 font-cinzel text-lg tracking-wider">01 / ASTRO-ALIGNED</div>
              <h3 className="text-xl font-bold text-white">Client Transit Logs</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Map each client's unique astrological blueprint. Store detailed birth time coordinates, house configurations, and natal charts securely in one panel.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-indigo-400 font-cinzel text-lg tracking-wider">02 / SMART SYSTEM</div>
              <h3 className="text-xl font-bold text-white">Automated AI Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Instantly distill complex astrological readings and notes into concise summaries with deep semantic AI comprehension.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-purple-400 font-cinzel text-lg tracking-wider">03 / STREAMLINED</div>
              <h3 className="text-xl font-bold text-white">Revenue Harmonization</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Integrate calendar schedules and payments seamlessly. View consultation growth metrics and track transaction statuses effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white tracking-wide">
              Complete Cosmic Command Center
            </h2>
            <p className="text-slate-400 text-base font-light leading-relaxed">
              Every detail optimized to support your energetic output, allowing you to focus on reading charts and delivering cosmic wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(99,102,241,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Client Natal Archives</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Maintain comprehensive profiles for clients. Track email, coordinates, birth parameters, and history to make every recurring session instantly cohesive.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(168,85,247,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Cosmic Scheduling</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Orchestrate reading appointments with ease. Status tags keep you updated on upcoming, scheduled, or past readings without cluttering.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(245,158,11,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">AI Reading Synthesizer</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Submit raw discussion notes, observations, or transit details. Let Gemini's AI generate structured, beautiful, client-ready summaries instantly.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(16,185,129,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Revenue Harmonizer</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Manage transactions and revenue. Track paid, pending, and refunded billing entries. See overall practice finances update on the dashboard.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(59,130,246,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Transit Mapping</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Quickly reference past session logs and client concerns to deliver contextualized transit readings during major planet cycles.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group relative glass-card p-8 text-left rounded-3xl border border-white/10 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(239,68,68,0.2)] overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Private & Encrypted</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                All client birth data, chart notes, and session notes are encrypted and fully private. You own your client relationships and notes.
              </p>
            </div>
          </div>
        </section>

        {/* Astro-Quote Section */}
        <section className="py-24 border-y border-white/5 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent relative">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <Star className="w-8 h-8 text-amber-300 mx-auto opacity-50" fill="currentColor" />
            <blockquote className="font-cinzel text-2xl md:text-3xl text-white tracking-wide leading-relaxed italic">
              "AstroManager completely transformed the administrative flow of my practice. I can lookup transit historical data in seconds, and my clients love the polished AI session summaries."
            </blockquote>
            <div>
              <cite className="not-italic font-bold text-slate-300 text-base">— Diana Vance, Celestial Counseling</cite>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-28 text-center px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/10 to-transparent pointer-events-none"></div>
          <div className="max-w-3xl mx-auto space-y-8 z-10 relative">
            <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-white tracking-wide">
              Step Into Your Power
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light max-w-2xl mx-auto">
              Align your appointments, clients, and revenue streams. Elevate the administrative design of your cosmic business today.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 text-white font-bold text-lg tracking-wider shadow-[0_0_35px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:-translate-y-1 transition-all duration-300"
            >
              Initialize AstroManager
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 border-t border-white/5 bg-[#020207] z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Status */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-widest text-white">AstroManager</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Cosmic Core v1.2.0 • Systems Operational</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => navigate('/dashboard/clients')} className="hover:text-white transition-colors">Clients</button>
            <button onClick={() => navigate('/dashboard/payments')} className="hover:text-white transition-colors">Payments</button>
            <button onClick={() => navigate('/dashboard/profile')} className="hover:text-white transition-colors">Profile</button>
          </div>

          {/* Copyright */}
          <div className="text-slate-600 text-xs text-center md:text-right">
            <span>© {new Date().getFullYear()} AstroManager. Crafted with celestial intention.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

