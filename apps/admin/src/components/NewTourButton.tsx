"use client";

import { useState } from "react";
import { Plus, CarFront, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewTourButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (type: 'private' | 'group') => {
    setIsOpen(false);
    router.push(`/tours/new?type=${type}`);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-slate-50 shadow hover:bg-orange-600 h-9 px-4 py-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Tour
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-2">Create New Tour</h3>
            <p className="text-slate-400 text-sm mb-8">What type of expedition are you creating?</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSelect('private')}
                className="flex flex-col items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-orange-500 hover:bg-slate-800/80 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CarFront className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-semibold text-white">Private Tour</span>
                <span className="text-xs text-slate-500 mt-1 text-center">Exclusive cab booking</span>
              </button>

              <button 
                onClick={() => handleSelect('group')}
                className="flex flex-col items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-orange-500 hover:bg-slate-800/80 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-semibold text-white">Group Tour</span>
                <span className="text-xs text-slate-500 mt-1 text-center">Scheduled date and time</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
