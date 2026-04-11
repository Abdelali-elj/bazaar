import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, badge, icon: Icon, action }: DashboardHeaderProps) {
  // Split title if it contains two words to apply the "Luxurious" style
  const words = title.split(' ');
  const firstWord = words[0];
  const remaining = words.slice(1).join(' ');

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center border border-[#F2EBE1] shadow-sm transform-gpu hover:-rotate-3 transition-transform hidden sm:flex shrink-0">
          <Icon className="text-[#1A2E28]" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-[#1A2E28] tracking-tight uppercase leading-none font-outfit">
            {firstWord} {remaining && <span className="text-[#C9A96E] italic font-medium font-playfair capitalize ml-2">{remaining}</span>}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            {badge && (
              <div className="px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 backdrop-blur-sm shadow-sm shrink-0">
                 <span className="text-[9px] font-black text-[#C9A96E] uppercase tracking-widest leading-none">{badge}</span>
              </div>
            )}
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] leading-none">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {action && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
