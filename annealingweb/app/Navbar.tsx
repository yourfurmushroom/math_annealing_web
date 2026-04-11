'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NavBar()
{
    const route=useRouter()
    const [currentPage,setCurrentPage]=useState<string>("")
    const [isOpen,setIsOpen]=useState<boolean>(false)

    function navigateToPage(location:string,title:string)
    {
        setCurrentPage(title)
        setIsOpen(false)
        route.push(`${location}`)
    }

    return(
        <nav className="fixed z-10 flex w-full flex-col bg-gray-300 lg:h-[8vh] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center justify-between px-4 py-3 lg:w-full lg:px-0 lg:py-0">
                <div className="cursor-pointer text-[22px] sm:text-[26px] lg:mx-10 lg:text-[32px]" onClick={()=>navigateToPage("/","首頁")}>
                    數位退火研發推動計畫
                </div>
                <button
                    type="button"
                    className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-md lg:hidden"
                    aria-label="Open menu"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}></span>
                    <span className={`block h-0.5 w-6 bg-black transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
                    <span className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
                </button>
            </div>
            <div className={`${isOpen ? "grid" : "hidden"} relative w-full grid-cols-1 gap-y-2 px-4 pb-3 text-center text-[15px] sm:text-[18px] lg:grid lg:w-[60%] lg:grid-cols-[repeat(6,1.5fr)_1fr] lg:gap-y-0 lg:px-0 lg:pb-0 lg:mx-10`}>
                <NavbarButton title="首頁" currentPage={currentPage} action={(title)=>navigateToPage("/",title)}/>
                <NavbarButton title="研究團隊" currentPage={currentPage} action={(title)=>navigateToPage("/team",title)}/>
                <NavbarButton title="TSP旅行推銷員" currentPage={currentPage} action={(title)=>navigateToPage("/TSP",title)}/>
            </div>
            
        </nav>
    )
}

interface NavbarButtonProps{
    title:string,
    currentPage:string,
    action:(title:string)=>void
}

function NavbarButton({title,currentPage,action}:NavbarButtonProps)
{
    return(
         <div className={`${title===currentPage? "text-blue-400 lg:scale-110":""} rounded-md border-white px-2 py-3 hover:text-blue-400 lg:last:border-r-0 lg:border-r-2 lg:px-0 lg:py-0 lg:hover:scale-110 duration-300 ease-in-out cursor-pointer`} onClick={()=>{action(title)}}>
            {title}
         </div>
    )
}
