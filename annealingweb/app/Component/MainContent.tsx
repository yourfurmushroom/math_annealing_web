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
            <h1 className="text-center text-[64px] font-bold text-black py-10 pt-[8vh]">
                研發與推廣
            </h1>

            <div className="w-full h-full p-10 mb-10 bg-gray-200 ">
                <div className=" flex justify-between items-center h-[5vh]">
                    <div onClick={() => setTab("algorithm")} className={`w-[50%] text-[32px] h-full text-center font-bold rounded-t-2xl ${tab === "algorithm" ? "bg-gray-300 " : "bg-white"}`} >演算法</div>
                    <div onClick={() => setTab("project")} className={`w-[50%] text-[32px]  h-full text-center font-bold rounded-t-2xl ${tab === "project" ? "bg-gray-300" : "bg-white "}`} >硬體</div>
                </div>

                {tab === "algorithm" &&
                    <div className="bg-gray-300 rounded-b-3xl py-15 w-full h-[60vh]">
                        <div className="flex justify-between gap-6 ">
                            <AlgorithmDetailCard title="數位退火技術" source="/annealing.gif"/>
                            <AlgorithmDetailCard title="GPU退火運算技術" source="/Quantum.png"/>
                        </div>
                        <div className="w-full p-10 text-[26px]">
                            {annealingDetail}
                        </div>
                    </div>
                }

                {tab === "project" && 
                <div className="flex justify-between gap-6 py-15 bg-gray-300 rounded-b-3xl h-[60vh]">
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
        <div className="w-[80%] h-[40vh] bg-white rounded-3xl flex flex-col items-center justify-center mx-10 shadow-2xl">

            <div className="flex-1 flex items-center justify-center w-full">
                <img src={source} className="w-[80%] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-center h-[5vh] text-[28px]">
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
        <div className={`w-[80%] ${isOpen?"h-[50vh]":"h-[40vh]"} bg-white rounded-3xl flex flex-col items-center justify-center mx-10 shadow-2xl`} onClick={() => setIsOpen(prev => !prev)}>

            <div className="flex-1 flex items-center justify-center w-full">
                <img src={source} className="w-[80%] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-center h-[5vh] text-[28px]">
                {isOpen?`⭡${title}⭡`:`↓${title}↓`}
            </div>

            {isOpen&&<div className="h-[10vh] p-10">
                {details}
                </div>}

        </div>
    )
}