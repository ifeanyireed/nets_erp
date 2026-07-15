"use client";

import React from "react";

export default function LoadingScreen({ message = "Synchronizing performance data..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-[#F0F2F5]/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 transition-all duration-300">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
        {/* Animated Glow Logo Ring Container */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Pulsing Backglow */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          
          {/* Inner Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-l-blue-600 animate-spin" />

          {/* Core Logo Dot */}
          <div className="w-6 h-6 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        </div>

        {/* Loading Message and Brand Details */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs uppercase tracking-widest font-black text-blue-600">{message}</h4>
          <p className="text-[11px] text-slate-400 font-bold">Please wait while we connect to the database.</p>
        </div>
      </div>
    </div>
  );
}
