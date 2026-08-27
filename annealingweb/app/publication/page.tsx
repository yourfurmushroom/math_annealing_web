"use client"

import { useState } from "react"
import { publications } from "../Data/publication"

export default function PublicationPage() {
  const [keyword, setKeyword] = useState("")

  const searchKeyword = keyword.trim().toLowerCase()

  const filteredPublications = publications.filter((item) => {
    if (!searchKeyword) {
      return true
    }

    return (
      item.title.toLowerCase().includes(searchKeyword) ||
      item.actor.toLowerCase().includes(searchKeyword) ||
      item.conference.toLowerCase().includes(searchKeyword)
    )
  })

  return (
    <main className="min-h-screen w-full bg-white dark:bg-slate-950">
      {/* 頂部 Banner */}
      <div className="relative flex h-[25vh] w-full items-end bg-[url('/annealing/background.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-slate-900/20" />

        <div className="relative z-10 w-full px-6 pb-8 lg:px-40">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            RELATED PUBLICATIONS
          </span>

          <h1 className="text-[42px] font-black leading-none text-white sm:text-[56px] lg:text-[70px]">
            相關文獻
          </h1>
        </div>
      </div>

      {/* 主要內容 */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* 介紹與搜尋 */}
        <div className="mb-12 flex flex-col gap-8 border-b border-slate-200 pb-10 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center border-l-4 border-blue-600 bg-blue-50 px-3 py-1 dark:bg-blue-900/20">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Publications
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              研究成果與相關論文
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              本頁整理數位退火器、組合最佳化、QUBO
              模型，以及相關軟硬體應用之研究文獻。
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-400">
              共 {publications.length} 篇文獻
            </p>
          </div>

          {/* 搜尋欄 */}
          <div className="w-full lg:max-w-md">
            <label
              htmlFor="publication-search"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-slate-400"
            >
              搜尋文獻
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <input
                id="publication-search"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜尋標題、作者或會議..."
                className="w-full border-b-2 border-slate-200 bg-transparent py-3 pl-11 pr-10 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-700 dark:text-white dark:focus:border-blue-500"
              />

              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  aria-label="清除搜尋"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-blue-600"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 搜尋結果數量 */}
        {searchKeyword && (
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            找到{" "}
            <span className="font-bold text-blue-600">
              {filteredPublications.length}
            </span>{" "}
            篇相關文獻
          </p>
        )}

        {/* 論文列表 */}
        {filteredPublications.length > 0 ? (
          <ol className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {filteredPublications.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="group py-8 transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 sm:px-4"
              >
                <div className="grid grid-cols-[3rem_1fr] gap-2 sm:grid-cols-[4rem_1fr]">
                  {/* 文獻編號 */}
                  <div className="pt-1 text-base font-bold text-blue-600 sm:text-lg">
                    [{index + 1}]
                  </div>

                  {/* 文獻資訊 */}
                  <div>
                    <h2 className="text-xl font-bold leading-relaxed text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-2xl">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                      {item.actor}
                    </p>

                    <p className="mt-2 text-sm font-medium italic leading-relaxed text-slate-500 dark:text-slate-500 sm:text-base">
                      {item.conference}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="border-y border-slate-200 py-20 text-center dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              找不到相關文獻
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              沒有找到包含
              <span className="mx-1 font-bold text-blue-600">
                「{keyword}」
              </span>
              的標題、作者或會議。
            </p>

            <button
              type="button"
              onClick={() => setKeyword("")}
              className="mt-6 border-b-2 border-blue-600 pb-1 font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              清除搜尋
            </button>
          </div>
        )}
      </section>
    </main>
  )
}