'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NavBar() {
    const itemsName: DropDownItem[] = [
        { title: "TSP", path: "/games/tsp" },
        { title: "迷宮", path: "/games/dungeon" },
        { title: "排班", path: "/games/schedule" }
    ]

    const route = useRouter()
    const [currentPage, setCurrentPage] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function navigateToPage(location: string, title: string) {
        setCurrentPage(title)
        setIsOpen(false)
        route.push(location)
    }

    return (
        <nav className="fixed z-50 flex w-full flex-col bg-gray-300 lg:h-[8vh] lg:flex-row lg:items-center lg:justify-between   ">
            <div className="flex w-full items-center justify-between px-4 py-3 lg:w-full lg:px-0 lg:py-0">
                <div
                    className="cursor-pointer text-[22px] sm:text-[26px] lg:mx-10 lg:text-[32px]"
                    onClick={() => navigateToPage("/", "首頁")}
                >
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

            <div className={`${isOpen ? "grid" : "hidden"} relative w-full gap-y-2 px-4 pb-3 text-center text-[15px] sm:text-[18px] lg:mx-10 lg:grid lg:w-[60%] lg:grid-cols-4 lg:gap-y-0 lg:px-0 lg:pb-0`}>
                <NavbarButton
                    title="首頁"
                    currentPage={currentPage}
                    action={(title) => navigateToPage("/", title)}
                />
                <NavbarButton
                    title="研究團隊"
                    currentPage={currentPage}
                    action={(title) => navigateToPage("/team", title)}
                />
                <NavbarButton
                    title="應用案例"
                    currentPage={currentPage}
                    action={(title) => navigateToPage("/applications", title)}
                />

                <DropDownNavbarButton
                    title="互動遊戲"
                    currentPage={currentPage}
                    items={itemsName}
                    navigateToPage={navigateToPage}
                />
            </div>
        </nav>
    )
}

interface NavbarButtonProps {
    title: string
    currentPage: string
    action: (title: string) => void
}

function NavbarButton({ title, currentPage, action }: NavbarButtonProps) {
    return (
        <div
            className={`${title === currentPage ? "text-blue-400 " : ""} cursor-pointer  border-white px-2 py-3 duration-300 ease-in-out hover:text-blue-400 lg:border-r-2 lg:px-0 lg:py-0 lg:last:border-r-0 lg:hover:scale-110`}
            onClick={() => { action(title) }}
        >
            {title}
        </div>
    )
}

interface DropDownItem {
    title: string
    path: string
}

interface DropDownProps {
    title: string
    currentPage: string
    items: DropDownItem[]
    navigateToPage: (location: string, title: string) => void
}

function DropDownNavbarButton({ title, currentPage, items, navigateToPage }: DropDownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                className={`${title === currentPage ? "text-blue-400" : ""} cursor-pointer border-white px-2 py-3 duration-300 ease-in-out hover:text-blue-400 lg:border-r-2 lg:px-0 lg:py-0 lg:last:border-r-0 ${isOpen ? "bg-gray-300 rounded-tr-md" : ""} `}
            >
                {title}
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 min-w-[160px] rounded-tr-md bg-gray-300 shadow-md rounded-b-md" >
                    {items.map((item) => (
                        <div
                            key={item.path}
                            className={`${item.title === currentPage ? "text-blue-400" : ""} cursor-pointer px-4 py-2 text-left hover:bg-gray-200 rounded-md`}
                            onClick={() => {
                                setIsOpen(false)
                                navigateToPage(item.path, item.title)
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}