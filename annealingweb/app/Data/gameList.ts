export interface DropDownItem {
    title: string
    path: string
}

export const itemsName:DropDownItem[] = [
        { title: "TSP", path: "/games/tsp" },
        { title: "數獨", path: "/games/sudoku" },
        { title: "迷宮", path: "/games/dungeon" },
        { title: "排班", path: "/games/schedule" }
    ]