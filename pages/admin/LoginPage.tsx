
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for any input
    onLogin('Admin');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nude-50 p-8">
      <div className="w-full max-w-md bg-white rounded-[4rem] p-16 shadow-2xl border border-nude-100 text-center space-y-12 animate-in fade-in duration-700">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl text-nude-500 font-bold">Studio Portal</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-nude-300 font-bold italic">Administrator Access</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Access Key</label>
            <input 
              required
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" 
            />
          </div>
          <button type="submit" className="w-full bg-nude-500 text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            Enter Dashboard
          </button>
        </form>

        <button onClick={() => navigate('/')} className="text-[10px] font-bold uppercase tracking-widest text-nude-200 hover:text-nude-400 transition-colors">
          &larr; Return to Public Site
        </button>
      </div>
    </div>
  );
};
