import Image from "next/image"
import { useState } from "react"

// 內容定義
const welcomeMessage = `本計畫旨在研發與推廣數位退火技術及 GPU 退火運算技術。
    透過模擬物理退火過程，我們在海量組合中尋求最優解，推動台灣在運算科技領域的競爭力。`

const annealingDetail = `
          退火原為冶金技術，透過將金屬加熱至高溫後緩慢降溫，使其內部結構重新排列至更整齊、能量更低且穩定的狀態。此概念延伸至最佳化領域，模擬「高溫」下二進位變數（0,1）易於改變，並允許暫時接受較高能量的狀態，藉由逐步降低虛擬溫度T，引導系統朝向更低能量且穩定的最佳解。
          退火計算（annealing）即是一種專為解決大型且複雜組合最佳化問題而設計的新型計算技術，與傳統電腦逐一搜尋不同，自大量可行解中平行搜尋快速收斂至理想解，特別適用於高維度、多變數的困難問題，大幅提升解題效率。`


const projectDetailHardware = `硬體方面著重於數位與GPU退火技術之整合應用，涉及組合優化、排班、大型實驗設計、藥物分子設計、光學微影光罩反向設計及MicroLED製程優化等領域。`

const projectDetailSoftware = `軟體方面探討QUBO模型的構建與轉換、AI求解策略，以及GPU平行運算效能提升，並透過本地化技術降低成本及增強彈性與隱私性。`

export default function MainContent() {
    const [tab, setTab] = useState<"algorithm" | "project">("algorithm")

    return (
        <div className="w-full bg-white dark:bg-slate-950">

            {/* 1. 歡迎區塊 (Hero Section) */}
            <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8 border-b border-slate-100 dark:border-slate-800 " id="mainContent">
                <div className="mx-auto max-w-5xl">
                    {/* 標題區塊：Pilot Research Programs of Digital Annealers */}
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white leading-tight">
                            Pilot Research Programs <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                of Digital Annealers
                            </span>
                        </h1>
                    </div>

                    <div className="mt-10 flex flex-col items-start w-full max-w-4xl">
                        {/* 標籤：About the Program */}
                        <div className="inline-flex items-center border-l-4 border-blue-600 bg-blue-50 px-4 py-2 mb-4 dark:bg-blue-900/20">
                            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                                About the Program
                            </span>
                        </div>

                        {/* 文字內容：緊跟在標籤下方 */}
                        <div className="text-left space-y-2">
                            <p className="whitespace-pre-line text-xl leading-snug text-slate-700 dark:text-slate-300 font-medium">
                                {welcomeMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            {/* 2. 研發與推廣區塊 */}
            < section className="bg-slate-50 py-24 dark:bg-slate-900/50" >
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">研發與推廣</h2>
                    </div>

                    {/* Tab 切換器 */}
                    <div className="mb-12 flex justify-center">
                        <div className="inline-flex rounded-2xl bg-slate-200 p-1.5 dark:bg-slate-800 shadow-inner">
                            <button
                                onClick={() => setTab("algorithm")}
                                className={`px-10 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${tab === "algorithm" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                核心演算法
                            </button>
                            <button
                                onClick={() => setTab("project")}
                                className={`px-10 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${tab === "project" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                軟硬體應用
                            </button>
                        </div>
                    </div>

                    {/* 內容展示區 */}
                    <div className="min-h-[600px] rounded-[3.5rem] bg-white p-8 shadow-xl ring-1 ring-slate-200 lg:p-16 dark:bg-slate-900 dark:ring-white/5 transition-all duration-500">
                        {tab === "algorithm" ? (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <h3 className="mb-6 text-3xl font-bold text-blue-600 underline underline-offset-8 decoration-blue-200">技術原理</h3>
                                {/* 佈局：圖在上、文在下 */}
                                <div className="mx-auto max-w-4xl text-center">
                                    <div className="mb-4 text-left relative h-[350px] sm:h-[450px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
                                        <Image
                                            src="/demo.png"
                                            alt="Annealing Principles"
                                            fill
                                            className="object-contain p-4"
                                        />
                                    </div>

                                    <p className="whitespace-pre-line text-lg leading-relaxed text-slate-700 dark:text-slate-300 text-left">
                                        {annealingDetail}
                                    </p>


                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-10 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <ProjectCard
                                    title="軟體研發技術"
                                    details={projectDetailSoftware}
                                    color="text-emerald-600"
                                    tags={["QUBO 模型", "AI 策略", "平行運算"]}
                                />
                                <ProjectCard
                                    title="硬體整合應用"
                                    details={projectDetailHardware}
                                    color="text-purple-600"
                                    tags={["組合優化","藥物設計", "光學微影"]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section >
        </div >
    )
}

/**
 * 應用卡片組件：支援 Tag 顯示與內容展開
 */
function ProjectCard({ title, details, color, tags }: { title: string, details: string, color: string, tags: string[] }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className="group cursor-pointer rounded-[2.5rem] border border-slate-100 bg-slate-50 p-10 transition-all hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-800/50"
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className={`text-2xl font-bold ${color}`}>{title}</h3>
                    <div className="flex gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-500 ${isOpen ? "rotate-180 bg-blue-50" : ""}`}>
                    <span className="text-xl">↓</span>
                </div>
            </div>

            <div className={`transition-all duration-500 ${isOpen ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}>
                <p className="whitespace-pre-line text-lg leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-6">
                    {details}
                </p>
            </div>

            {!isOpen && (
                <p className="mt-6 text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition-colors flex items-center gap-2">
                    點擊展開應用細節
                </p>
            )}
        </div>
    )
}