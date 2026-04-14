'use client'
import Image from "next/image";
import { applications, Application } from "../Data/application"
import { member } from "../Data/member"
import { useState } from "react";

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-slate-950 min-h-screen">
      <div className="relative mt-[120px] h-[25vh] w-full bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat lg:mt-[8vh] flex items-end">
        <div className="absolute inset-0 bg-slate-900/20">
        </div>
        <div className="relative z-10 w-full px-6 pb-8 lg:px-40">
          <span className="block text-sm font-bold tracking-[0.2em] text-white/80 uppercase mb-2">
            applications
          </span>
          <h1 className="text-white font-black text-[42px] sm:text-[56px] lg:text-[70px] leading-none">
            應用案例
          </h1>
        </div>
      </div>

      <div className="flex flex-col m-10 w-[80%] mx-auto gap-6">
        {applications.map((x, i) => (
          <ApplicationCard x={x} key={i}>
          </ApplicationCard>
        ))}
      </div>
    </main>
  );
}

interface ApplicationCardProps {
  x: Application
}

function ApplicationCard({ x }: ApplicationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const memberDetails = member.filter((e) => x.director.includes(e.name));

  return (
    <div className={`w-full border-2 border-slate-200 rounded-[3rem] shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-500 ease-in-out bg-white overflow-hidden ${isOpen ? "min-h-[900px] p-10 lg:p-14" : "h-[240px] p-16 hover:border-slate-400"}`} onClick={() => setIsOpen(prev => !prev)}>
      {!isOpen && (
        <div className="flex justify-between items-center h-full gap-8">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 w-[60%]">
            {x.name}
          </h1>

          <div className="w-[40%] space-y-4 text-right">
            {memberDetails.map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-2xl font-bold text-blue-600 uppercase break-words">
                  {item.name}
                </div>
                <div className="text-lg font-medium text-slate-400 break-words">
                  {Array.isArray(item.otherPosition) ? item.otherPosition.join(" / ") : item.otherPosition}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="w-full h-full animate-in fade-in duration-500" >
          <div className="flex flex-col gap-8 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 p-6 lg:p-8 shadow-lg ring-1 ring-slate-200">
            <div className="border-b border-slate-200 pb-6">
              <div className="text-sm font-bold tracking-[0.25em] text-slate-400 uppercase mb-3">
                Application
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                {x.name}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                Director
              </div>

              <div className="flex flex-wrap gap-6">
                {memberDetails.map((item, i) => {
                  const directorImagePath =
                    item.imagePath.startsWith("http://") || item.imagePath.startsWith("https://")
                      ? item.imagePath
                      : item.imagePath.startsWith("/")
                        ? item.imagePath
                        : `/${item.imagePath}`;

                  return (
                    <div key={i} className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 " onClick={(e) => e.stopPropagation()}>
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-2 ring-slate-100">
                        <Image src={directorImagePath} alt={item.name} width={80} height={80} unoptimized className="w-full h-full object-cover">
                        </Image>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-lg font-bold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {Array.isArray(item.otherPosition) ? item.otherPosition.join(" / ") : item.otherPosition}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {x.imagePath?.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                  Gallery
                </div>

                <div className="overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-4 items-start min-w-max">
                    {x.imagePath.map((img, index) => {
                      const applicationImagePath =
                        img.startsWith("http://") || img.startsWith("https://")
                          ? img
                          : img.startsWith("/")
                            ? img
                            : `/${img}`;

                      return (
                        <div key={index} className="shrink-0 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                          <Image src={applicationImagePath} alt={`image-${index}`} width={320} height={320} unoptimized className="w-auto h-auto max-h-[420px] rounded-xl object-contain">
                          </Image>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
                Details
              </div>
              <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 " onClick={(e) => e.stopPropagation()}>
                <p className="text-lg lg:text-2xl leading-relaxed font-medium text-slate-700 whitespace-pre-line">
                  {x.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}