'use client'
import Image from "next/image";
import { member } from "../Data/member";

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-slate-950 min-h-screen">
      {/* Background Banner */}
      <div className="relative mt-[120px] h-[25vh] w-full bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat lg:mt-[8vh] flex items-end">
        {/* 增加深色遮罩確保文字清晰度 */}
        <div className="absolute inset-0 bg-slate-900/20"></div>
        
        <div className="relative z-10 w-full px-6 pb-8 lg:px-40">
          <span className="block text-sm font-bold tracking-[0.2em] text-white/80 uppercase mb-2">
            applications
          </span>
          <h1 className="text-white font-black text-[42px] sm:text-[56px] lg:text-[70px] leading-none">
            應用案例
          </h1>
        </div>
      </div>
    </main>
  );
}