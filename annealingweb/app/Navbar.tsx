'use client'
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { itemsName,DropDownItem } from "./Data/gameList";
export default function NavBar() {
    

    const route = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function isActivePath(location: string) {
        return location === "/" ? pathname === "/" : pathname === location || pathname.startsWith(`${location}/`)
    }

    function navigateToPage(location: string) {
        setIsOpen(false)
        route.push(location)
    }

    return (
        <nav className="fixed left-0 top-0 z-50 flex w-full flex-col bg-gray-300 lg:h-[8vh] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center justify-between px-4 py-3 lg:w-full lg:px-0 lg:py-0">
                <div
                    className="cursor-pointer text-[22px] sm:text-[26px] lg:mx-10 lg:text-[32px]"
                    onClick={() => navigateToPage("/")}
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

            <div className={`${isOpen ? "grid" : "hidden"} relative w-full gap-y-2 px-4 pb-3 text-center text-[15px] sm:text-[18px] lg:mx-10 lg:grid lg:w-[60%] lg:grid-cols-5 lg:gap-y-0 lg:px-0 lg:pb-0`}>
                <NavbarButton
                    title="首頁"
                    isActive={isActivePath("/")}
                    action={() => navigateToPage("/")}
                />
                <NavbarButton
                    title="研究團隊"
                    isActive={isActivePath("/team")}
                    action={() => navigateToPage("/team")}
                />
                <NavbarButton
                    title="應用案例"
                    isActive={isActivePath("/applications")}
                    action={() => navigateToPage("/applications")}
                />

                <NavbarButton
                    title="相關文獻"
                    isActive={isActivePath("/publication")}
                    action={() => navigateToPage("/publication")}
                />
                <DropDownNavbarButton
                    title="互動遊戲"
                    pathname={pathname}
                    items={itemsName}
                    navigateToPage={navigateToPage}
                />
            </div>
        </nav>
    )
}

interface NavbarButtonProps {
    title: string
    isActive: boolean
    action: () => void
}

function NavbarButton({ title, isActive, action }: NavbarButtonProps) {
    return (
        <div
            className={`${isActive ? "text-blue-400 " : ""} cursor-pointer  border-white px-2 py-3 duration-300 ease-in-out hover:text-blue-400 lg:border-r-2 lg:px-0 lg:py-0 lg:last:border-r-0 lg:hover:scale-110`}
            onClick={action}
        >
            {title}
        </div>
    )
}


interface DropDownProps {
    title: string
    pathname: string
    items: DropDownItem[]
    navigateToPage: (location: string) => void
}

function DropDownNavbarButton({ title, pathname, items, navigateToPage }: DropDownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const isActiveItem = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
    const hasActiveItem = items.some((item) => isActiveItem(item.path))

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                className={`${hasActiveItem ? "text-blue-400" : ""} cursor-pointer border-white px-2 py-3 duration-300 ease-in-out hover:text-blue-400 lg:border-r-2 lg:px-0 lg:py-0 lg:last:border-r-0 ${isOpen ? "bg-gray-300 rounded-tr-md" : ""} `}
            >
                {title}
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 min-w-[160px] rounded-tr-md bg-gray-300 shadow-md rounded-b-md" >
                    {items.map((item) => (
                        <div
                            key={item.path}
                            className={`${isActiveItem(item.path) ? "text-blue-400" : ""} cursor-pointer px-4 py-2 text-left hover:bg-gray-200 rounded-md`}
                            onClick={() => {
                                setIsOpen(false)
                                navigateToPage(item.path)
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
