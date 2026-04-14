'use client'
import Image from "next/image";
import { member } from "../Data/member";

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-slate-950 min-h-screen">
      {/* 1. Background Banner */}
      <div className="relative mt-[120px] h-[25vh] w-full bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat lg:mt-[8vh] flex items-end">
        {/* 增加深色遮罩確保文字清晰度 */}
        <div className="absolute inset-0 bg-slate-900/20"></div>
        
        <div className="relative z-10 w-full px-6 pb-8 lg:px-40">
          <span className="block text-sm font-bold tracking-[0.2em] text-white/80 uppercase mb-2">
            RESEARCH TEAM
          </span>
          <h1 className="text-white font-black text-[42px] sm:text-[56px] lg:text-[70px] leading-none">
            團隊成員
          </h1>
        </div>
      </div>

      {/* 2. 成員卡片列表 - 調整間距與背景 */}
      <div className="mx-auto max-w-6xl px-6 py-20 space-y-12">
        {member.map((x, i) => (
          <MemberCard 
            key={i} 
            imagePath={x.imagePath} 
            labPath={x.labPath} 
            subTitle={x.subTitle} 
            name={x.name} 
            position={x.position} 
            otherPosition={x.otherPosition} 
          />
        ))}
      </div>
    </main>
  );
}

interface MemberCardProps {
  imagePath: string,
  labPath: string,
  subTitle: string,
  name: string,
  position: string,
  otherPosition: string[],
}
function MemberCard({ imagePath, labPath, subTitle, name, position, otherPosition }: MemberCardProps) {
  const memberImagePath =
  imagePath.startsWith("http://") || imagePath.startsWith("https://")
    ? imagePath
    : imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

  // 實作點擊跳轉函式
  const handleCardClick = () => {
    window.open(labPath, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative mx-auto grid w-full cursor-pointer grid-cols-1 overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:grid-cols-[3fr_7fr] lg:min-h-[35vh] dark:bg-slate-900 dark:ring-white/10"
    >
      
      {/* 圖片區塊 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 md:aspect-auto">
        <Image 
          src={memberImagePath} 
          alt={name} 
          fill
          unoptimized 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* 文字內容區塊 */}
      <div className="flex flex-col justify-center p-6 lg:p-10 text-left">
        
        {/* 單位標籤 */}
        <div className="mb-4 inline-flex items-center self-start border-l-4 border-blue-600 bg-blue-50 px-3 py-1 dark:bg-blue-900/20">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            {subTitle}
          </span>
        </div>

        {/* 姓名與職稱 */}
        <div className="mb-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline">
            <span className="text-3xl font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white lg:text-[45px] leading-tight">
              {name}
            </span>
            <span className="text-xl font-medium text-slate-500 dark:text-slate-400 sm:ml-4">
              {position}
            </span>
          </div>
          <hr className="mt-4 border-slate-100 dark:border-slate-800 w-full" />
        </div>

        {/* 現任職務列表 */}
        <div className="text-left">
          <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">現任職務</h4>
          <ul className="space-y-2">
            {otherPosition.map((pos, i) => (
              <li key={i} className="flex items-start text-[16px] sm:text-[18px] text-slate-600 dark:text-slate-400 leading-snug">
                <span className="mr-2 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                {pos}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右下角互動箭頭：現在整張卡片 Hover 時都會更明顯 */}
      <div className="absolute right-10 bottom-10 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 hidden lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
             <line x1="7" y1="17" x2="17" y2="7"></line>
             <polyline points="7 7 17 7 17 17"></polyline>
           </svg>
        </div>
      </div>
    </div>
  );
}