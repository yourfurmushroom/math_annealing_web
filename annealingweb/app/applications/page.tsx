"use client";

import Image from "next/image";
import { useState } from "react";
import {
  applications,
  Application,
} from "../Data/application";
import { member } from "../Data/member";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-slate-950">
      {/* 頂部 Banner */}
      <div className="relative flex h-[25vh] w-full items-end bg-[url('/annealing/background.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-slate-900/20" />

        <div className="relative z-10 w-full px-6 pb-8 lg:px-40">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Applications
          </span>

          <h1 className="text-[42px] font-black leading-none text-white sm:text-[56px] lg:text-[70px]">
            應用案例
          </h1>
        </div>
      </div>

      {/* 應用案例列表 */}
      <div className="mx-auto my-10 flex w-[90%] flex-col gap-6 lg:w-[80%]">
        {applications.map((application, index) => (
          <ApplicationCard
            key={`${application.name}-${index}`}
            x={application}
          />
        ))}
      </div>
    </main>
  );
}

interface ApplicationCardProps {
  x: Application;
}

function ApplicationCard({ x }: ApplicationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const memberDetails = member.filter((item) =>
    x.director.includes(item.name)
  );

  const hasLink = Boolean(x.link?.trim());

  return (
    <div
      className={`
        w-full cursor-pointer overflow-hidden rounded-[3rem]
        border-2 border-slate-200 bg-white shadow-sm
        transition-all duration-500 ease-in-out
        hover:border-slate-400 hover:shadow-2xl
        ${
          isOpen
            ? "p-6 sm:p-10 lg:p-14"
            : "min-h-[240px] p-8 sm:p-12 lg:p-16"
        }
      `}
      onClick={() => setIsOpen((previous) => !previous)}
    >
      {/* Card 尚未展開 */}
      {!isOpen && (
        <div className="flex min-h-[110px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:w-[60%] lg:text-4xl">
            {x.name}
          </h2>

          <div className="space-y-4 text-left sm:w-[40%] sm:text-right">
            {memberDetails.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex flex-col"
              >
                <div className="break-words text-xl font-bold uppercase text-blue-600 lg:text-2xl">
                  {item.name}
                </div>

                <div className="break-words text-base font-medium text-slate-400 lg:text-lg">
                  {Array.isArray(item.otherPosition)
                    ? item.otherPosition.join(" / ")
                    : item.otherPosition}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card 展開內容 */}
      {isOpen && (
        <div className="h-full w-full animate-in fade-in duration-500">
          <div className="flex flex-col gap-8 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg ring-1 ring-slate-200 lg:p-8">
            {/* 標題 */}
            <div className="border-b border-slate-200 pb-6">
              <div className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                Application
              </div>

              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
                {x.name}
              </h2>
            </div>

            {/* 負責人 */}
            <div className="flex flex-col gap-4">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Director
              </div>

              <div className="flex flex-wrap gap-6">
                {memberDetails.map((item, index) => {
                  const directorImagePath =
                    item.imagePath.startsWith("http://") ||
                    item.imagePath.startsWith("https://")
                      ? item.imagePath
                      : item.imagePath.startsWith("/")
                        ? item.imagePath
                        : `/${item.imagePath}`;

                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-100">
                        <Image
                          src={directorImagePath}
                          alt={item.name}
                          width={80}
                          height={80}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col">
                        <div className="text-lg font-bold text-slate-900">
                          {item.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {Array.isArray(item.otherPosition)
                            ? item.otherPosition.join(" / ")
                            : item.otherPosition}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 圖片區域 */}
            {x.imagePath?.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                  Gallery
                </div>

                <div
                  className="overflow-x-auto pb-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex min-w-max items-start gap-4">
                    {x.imagePath.map((image, index) => {
                      const applicationImagePath =
                        image.startsWith("http://") ||
                        image.startsWith("https://")
                          ? image
                          : image.startsWith("/")
                            ? image
                            : `/${image}`;

                      return (
                        <div
                          key={`${image}-${index}`}
                          className="shrink-0 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
                        >
                          <Image
                            src={`/annealing/${applicationImagePath}`}
                            alt={`${x.name} 圖片 ${index + 1}`}
                            width={320}
                            height={320}
                            unoptimized
                            className="h-auto max-h-[420px] w-auto max-w-[75vw] rounded-xl object-contain"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 詳細說明 */}
            <div className="flex flex-col gap-4">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Details
              </div>

              <div
                className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="whitespace-pre-line text-lg font-medium leading-relaxed text-slate-700 lg:text-2xl">
                  {x.details}
                </p>
              </div>
            </div>

            {/* 詳細資訊按鈕 */}
            <div
              className="flex justify-end border-t border-slate-200 pt-6"
              onClick={(event) => event.stopPropagation()}
            >
              {hasLink ? (
                <a
                  href={x.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-blue-600 px-7 py-3.5
                    text-base font-bold text-white shadow-md
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-blue-700
                    hover:shadow-xl
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-300
                    active:scale-95
                  "
                >
                  詳細資訊

                  <ExternalLinkIcon />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="
                    inline-flex cursor-not-allowed items-center
                    justify-center gap-2 rounded-xl
                    bg-slate-200 px-7 py-3.5
                    text-base font-bold text-slate-400
                  "
                >
                  詳細資訊尚未提供

                  <ExternalLinkIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12.75V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18v-7.5A1.5 1.5 0 0 1 6 9h5.25"
      />
    </svg>
  );
}