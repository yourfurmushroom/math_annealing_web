'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NavBar()
{
    const route=useRouter()

    const [currentPage,setCurrentPage]=useState<string>("")

    function navigateToPage(location:string,title:string)
    {
        setCurrentPage(title)
        route.push(`${location}`)
    }

    return(
        <nav className=" w-full h-[8vh] flex justify-between items-center bg-gray-300 z-10 fixed">
            <div className=" w-full text-[32px] mx-10 cursor-pointer" onClick={()=>navigateToPage("/","首頁")}>
                數位退火研發推動計畫
            </div>
            <div className="relative w-[60%] grid grid-cols-[repeat(6,1.5fr)_1fr] mx-10 text-center">
                <NavbarButton title="首頁" currentPage={currentPage} action={(title)=>navigateToPage("/",title)}/>
                <NavbarButton title="關於我們" currentPage={currentPage} action={(title)=>navigateToPage("/aboutme",title)}/>
                <NavbarButton title="研究團隊" currentPage={currentPage} action={(title)=>navigateToPage("/team",title)}/>
                <NavbarButton title="最新活動" currentPage={currentPage} action={(title)=>navigateToPage("/newevents",title)}/>
                <NavbarButton title="最新消息" currentPage={currentPage} action={(title)=>navigateToPage("/news",title)}/>
                <NavbarButton title="聯絡我們" currentPage={currentPage} action={(title)=>navigateToPage("/contactus",title)}/>
                <NavbarButton title="english" currentPage={currentPage} action={(title)=>{}}/>
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
         <div className={`${title===currentPage? "text-blue-400 scale-110":""} border-r-2 last:border-r-0 border-white hover:scale-110 hover:text-blue-400  duration-300 ease-in-out cursor-pointer`} onClick={()=>{action(title)}}>{title}</div>
    )
}