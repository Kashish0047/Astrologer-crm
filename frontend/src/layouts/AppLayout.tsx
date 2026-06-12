import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#04040c] text-white relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Starry Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-950/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-amber-950/10 blur-[130px] pointer-events-none" />

      {/* Thin ambient cosmic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_40%,transparent_100%)] pointer-events-none"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
