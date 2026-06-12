import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a12] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-indigo-400 rounded-full blur-[2px] animate-pulse-slow" />
      <div className="absolute bottom-[30%] right-[20%] w-3 h-3 bg-purple-400 rounded-full blur-[2px] animate-pulse-slow delay-1000" />
      <div className="absolute top-[40%] right-[30%] w-1.5 h-1.5 bg-blue-400 rounded-full blur-[1px] animate-pulse-slow delay-500" />
      
      <div className="w-full max-w-md z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-indigo-500" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Lost in the Cosmos</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for seems to have drifted into another dimension. Let's get you back home.
        </p>
        
        <div className="flex justify-center">
          <Button variant="primary" icon={<Home className="w-4 h-4" />} onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
