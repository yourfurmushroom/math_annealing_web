'use client';
import React, { SetStateAction, useState } from 'react';
import { Constraint } from "./Utilities";

interface WorkerData {
    name: string;
    status: string[];
}
interface ShiftAreaProps {
    name: string;
    data: WorkerData[];
    column: number;
    toWs: (operation: string) => void,
    gridStatus: string[][],
    setGridStatus: React.Dispatch<React.SetStateAction<string[][]>>,
    refresh: () => void,
    setModify: React.Dispatch<React.SetStateAction<boolean>>,
    isModify: boolean,
    constraints: Constraint[];
}

export default function ShiftArea({ name, data, column, toWs, gridStatus, setGridStatus, setModify, refresh, isModify,constraints }: ShiftAreaProps) {
    const [machine,setMachine]=useState<string>("compal")

    const updateCellStatus = (rowIndex: number, colIndex: number, value: string) => {
        setGridStatus((prev) => {
            const newStatus = prev.map((row) => [...row]);
            if (rowIndex < newStatus.length && colIndex < newStatus[rowIndex].length) {
                newStatus[rowIndex][colIndex] = value;
            }
            return newStatus;
        });
    };



    const SendToWs = (action: string) => {
        const scheduleData = data.map((worker, rowIndex) => ({
            ...worker,
            status: gridStatus[rowIndex] ?? worker.status,
        }));
        console.log(JSON.stringify({ data: scheduleData, constraints }))
        toWs(JSON.stringify({
            action: action,
            data: scheduleData,
            constraints: constraints,
            machine: machine,
            user: "default_user",
            schedulename: name,
        }));
    }


    return (
        <>
            <div className='w-[100%]'>
                <RemoteBar SendToWs={(e: string) => SendToWs(e)} name={name} setModify={setModify} refresh={() => refresh()} isModify={isModify} machine={machine} setMachine={setMachine}></RemoteBar>
            </div>
            <div className="w-[100%] h-[80vh] flex justify-center">
                <div className="w-full overflow-scroll bg-white border border-gray-300">
                    <TitleRow column={column} />
                    {gridStatus.length === data.length &&
                        data.every((_, i) => gridStatus[i]?.length >= column) ? (
                        <GridBody data={data} gridStatus={gridStatus} updateCellStatus={updateCellStatus} isModify={isModify} />) : (
                        <div className="text-center p-4 text-gray-500">載入中...</div>
                    )}
                </div>
            </div>
        </>
    );
}

function RemoteBar({ SendToWs, name, setModify, refresh, isModify,machine,setMachine }: { SendToWs: (e: string) => void, name: string, setModify: React.Dispatch<React.SetStateAction<boolean>>, refresh: () => void, isModify: boolean,machine:string,setMachine:React.Dispatch<SetStateAction<string>> }) {
    return (
        <div className="bg-gray-200 flex justify-between items-center h-[5vh]">
            <div className='font-bold text-[28px] p-3'>{name}</div>
            <div>
                <ControlPanel SendToWs={(e) => SendToWs(e)} setModify={setModify} refresh={() => refresh()} isModify={isModify} machine={machine} setMachine={setMachine}></ControlPanel>
            </div>
        </div>
    )
}

function TitleRow({ column }: { column: number }) {
    return (
        <div className="flex w-full min-w-[800px] border-b border-gray-300">
            <div className="w-[10%] min-w-[50px] text-center font-bold bg-gray-200 p-2 shrink-0">
                員工\日
            </div>
            {Array.from({ length: column }).map((_, i) => (
                <div key={i} className="w-[10%] min-w-[50px] text-center font-bold bg-gray-100 p-2 whitespace-nowrap">{i + 1}</div>
            ))}
        </div>
    );
}

function GridBody({ data, gridStatus, updateCellStatus, isModify }: { data: WorkerData[]; gridStatus: string[][]; updateCellStatus: (rowIndex: number, colIndex: number, value: string) => void, isModify: boolean }) {
    return (
        <div className="w-full min-w-[800px]">
            {data.map((worker, rowIndex) => (
                <div key={rowIndex} className="flex w-full border-b border-gray-200">
                    <div className="w-[10%] min-w-[50px] text-center bg-gray-100 p-2 shrink-0">
                        {worker.name}
                    </div>
                    {worker.status.map((_, colIndex) => (
                        <GridCell key={colIndex} rowIndex={rowIndex} colIndex={colIndex} value={gridStatus[rowIndex][colIndex]} updateCellStatus={updateCellStatus} workerName={worker.name} isModify={isModify} />
                    ))}
                </div>
            ))}
        </div>
    );
}

function GridCell({ rowIndex, colIndex, value, updateCellStatus, workerName, isModify }: { rowIndex: number, colIndex: number, value: string, updateCellStatus: (rowIndex: number, colIndex: number, value: string) => void; workerName: string, isModify: boolean }) {
    return (
        <div title={`${workerName}的第${colIndex + 1}日`} className="w-[10%] min-w-[50px] h-10 text-center p-2 whitespace-nowrap overflow-hidden text-ellipsis">
            <select
                value={value}
                disabled={!isModify}
                onChange={(e) => updateCellStatus(rowIndex, colIndex, e.target.value)}
                className={`w-full h-full appearance-none text-center duration-300 ease-in-out ${
                    value === '上班' ? 'text-black' :
                    value === '待命' ? 'text-blue-400' :'text-red-300'} bg-transparent border-none focus:outline-none cursor-pointer`}>
                <option value="上班">上班</option>
                <option value="待命">待命</option>
                <option value="休息">休息</option>
            </select>
        </div>
    );
}

function ControlPanel({ SendToWs, refresh, setModify, isModify,machine,setMachine }: { SendToWs: (e: string) => void, setModify: React.Dispatch<React.SetStateAction<boolean>>, refresh: () => void, isModify: boolean ,machine:string,setMachine:React.Dispatch<SetStateAction<string>>}) {
    return (
        <div className='flex items-center gap-x-6 px-4 '>
            <div>
                <select value={machine} onChange={(e)=>setMachine(e.target.value)}>
                <option value="compal">仁寶</option>
                <option value="fujitsu">富士通</option>
                <option value="da">模擬退火</option>
                </select>
            </div>
            <div title="計算" className=' hover:scale-120 duration-200 ease-in-out' onClick={() => SendToWs('Calculate')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                </svg>
            </div>
            <div title="刷新" className=' hover:scale-120 duration-200 ease-in-out' onClick={() => { refresh() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </div>
            <div title="修改" className={` ${isModify ? "scale-125 border-2 border-blue-500 animate-pulse hover:scale-150" : "hover:scale-125 duration-200 ease-in-out"}`} onClick={() => setModify((prev) => !prev)} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
            </div>
            <div title="保存" className=' hover:scale-120 duration-200 ease-in-out' onClick={() => SendToWs('Save')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                </svg>
            </div>
        </div>
    )
}
