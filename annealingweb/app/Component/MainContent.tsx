import Image from "next/image"
import { useState } from "react"

const annealingDetail = `退火原為冶金技術，透過將金屬加熱至高溫後緩慢降溫，使其內部結構重新排列至更整齊、能量更低且穩定的狀態。
          此概念延伸至最佳化領域，模擬「高溫」下二進位變數（0,1）易於改變，並允許暫時接受較高能量的狀態，藉由逐步降低虛擬溫度T，引導系統朝向更低能量且穩定的最佳解。
          退火計算（annealing）即是一種專為解決大型且複雜組合最佳化問題而設計的新型計算技術，與傳統電腦逐一搜尋不同，自大量可行解中平行搜尋快速收斂至理想解。`

const projectDetailSoftware=`軟體方面則探討QUBO模型的構建與轉換、AI求解策略，以及GPU平行運算效能提升，並透過本地化技術降低成本及增強彈性與隱私性。
          此外，將建立退火平台服務，協助學界及業界驗證與推廣退火技術。`

const projectDetailHardware=`硬體方面著重於數位與GPU退火技術之整合應用，涉及組合優化、排班、大型實驗設計、藥物分子設計、光學微影光罩反向設計及MicroLED製程優化等領域
          `

export default function MainContent() {

    const [tab, setTab] = useState<"algorithm" | "project">("algorithm")

    return (
        <div className="w-full bg-gray-200" id="mainContent">
            <h1 className="py-10 pt-[120px] text-center text-[42px] font-bold text-black sm:text-[52px] lg:pt-[8vh] lg:text-[64px]">
                研發與推廣
            </h1>

            <div className="mb-10 w-full bg-gray-200 px-4 py-4 sm:px-6 lg:p-10">
                <div className="flex justify-between items-center">
                    <div onClick={() => setTab("algorithm")} className={`w-[50%] cursor-pointer text-[22px] sm:text-[26px] lg:h-[5vh] lg:text-[32px] h-full text-center font-bold rounded-t-2xl ${tab === "algorithm" ? "bg-gray-300 " : "bg-white"}`} >演算法</div>
                    <div onClick={() => setTab("project")} className={`w-[50%] cursor-pointer text-[22px] sm:text-[26px] lg:h-[5vh] lg:text-[32px] h-full text-center font-bold rounded-t-2xl ${tab === "project" ? "bg-gray-300" : "bg-white "}`} >硬體</div>
                </div>

                {tab === "algorithm" &&
                    <div className="w-full rounded-b-3xl bg-gray-300 px-4 py-8 lg:h-[60vh] lg:py-15">
                        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                            <AlgorithmDetailCard title="數位退火技術" source="/annealing.gif"/>
                            <AlgorithmDetailCard title="GPU退火運算技術" source="/Quantum.png"/>
                        </div>
                        <div className="w-full p-4 text-[18px] sm:text-[22px] lg:p-10 lg:text-[26px]">
                            {annealingDetail}
                        </div>
                    </div>
                }

                {tab === "project" && 
                <div className="flex flex-col gap-6 rounded-b-3xl bg-gray-300 px-4 py-8 lg:h-[60vh] lg:flex-row lg:justify-between lg:py-15">
                        <ProjectDetailCard title="軟體" source="/annealing.gif" details={projectDetailSoftware}/>
                        <ProjectDetailCard title="硬體" source="/Quantum.png" details={projectDetailHardware}/>
                </div>}

            </div>

        </div>
    )
}

interface AlgorithmDetailCardProps {
    title: string,
    source: string
}
function AlgorithmDetailCard({ title, source }: AlgorithmDetailCardProps) {
    return (
        <div className="mx-0 flex w-full flex-col items-center justify-center rounded-3xl bg-white p-5 shadow-2xl lg:mx-10 lg:h-[50vh] lg:w-[80%]">

            <div className="flex flex-1 items-center justify-center w-full">
                <Image src={source} alt={title} width={480} height={320} unoptimized className="w-[80%] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-center text-center text-[22px] sm:text-[24px] lg:h-[5vh] lg:text-[28px]">
                {title}
            </div>

        </div>
    )
}

interface ProjectDetailCardProps {
    title: string,
    details:string,
    source: string
}
function ProjectDetailCard({ title,details, source }: ProjectDetailCardProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)


    return (
        <div className={`mx-0 w-full cursor-pointer rounded-3xl bg-white p-5 shadow-2xl lg:mx-10 lg:w-[80%] ${isOpen?"lg:h-[60vh]":"lg:h-[50vh]"}`} onClick={() => setIsOpen(prev => !prev)}>

            <div className="flex items-center justify-center w-full">
                <Image src={source} alt={title} width={480} height={320} unoptimized className="w-[80%] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-center text-center text-[22px] sm:text-[24px] lg:h-[5vh] lg:text-[28px]">
                {isOpen?`⭡${title}⭡`:`↓${title}↓`}
            </div>

            {isOpen&&<div className="p-4 text-[18px] sm:text-[20px] lg:h-[10vh] lg:p-10">
                {details}
                </div>}

        </div>
    )
}
