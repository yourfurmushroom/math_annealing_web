'use client'
import React, { useEffect, useState, startTransition } from "react";
import ShiftArea from "./Component/ShiftArea";
import AttributePanel from "./Component/AttributePanel";

interface WorkerData {
  name: string;
  status: string[];
}
interface Constraint {
  name: string;
  parameters: Record<string, any>;
}

export default function Dashboard() {
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(30);
  const [name, setName] = useState<string>("untitled");
  const [isModify, setModify] = useState<boolean>(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [gridStatus, setGridStatus] = useState<string[][]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [usedTime,setUsedTime]=useState<number>(0)
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [returnData, setReturnData] = useState<string>("[]");


  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPending) {
      setUsedTime(0); // 每次重新開始計算時歸零
      timer = setInterval(() => {
        setUsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPending]);


  const GenerateWorkerData = (returnData: string) => {
    let parsed: WorkerData[];

    try {
      parsed = JSON.parse(returnData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      parsed = [];
    }

    if (parsed.length < row) {
      const toAdd = row - parsed.length;
      for (let i = 0; i < toAdd; i++) {
        parsed.push({
          name: `Worker ${parsed.length + 1}`,
          status: Array(column).fill("上班"),
        });
      }
    } else if (parsed.length > row) {
      parsed = parsed.slice(0, row);
    }

    parsed = parsed.map((worker) => {
      const status = [...worker.status];
      if (status.length > column) {
        status.length = column;
      } else if (status.length < column) {
        status.push(...Array(column - status.length).fill("上班"));
      }
      return { ...worker, status };
    });
    return parsed;
  };

  const refresh = (parsed: WorkerData[]) => {
    const initialStatus = Array(row)
      .fill(null)
      .map(() => Array(column).fill("上班"));

    parsed.forEach((worker, rowIndex) => {
      if (rowIndex < row) {
        worker.status.forEach((status, colIndex) => {
          if (colIndex < column) {
            initialStatus[rowIndex][colIndex] = status;
          }
        });
      }
    });

    setGridStatus(initialStatus);
  };

  // 初始 gridStatus (避免空白)
  useEffect(() => {
    const parsed: WorkerData[] = GenerateWorkerData(returnData);
    const initialStatus = Array(row)
      .fill(null)
      .map(() => Array(column).fill("上班"));

    parsed.forEach((worker, rowIndex) => {
      if (rowIndex < row) {
        worker.status.forEach((status, colIndex) => {
          if (colIndex < column) {
            initialStatus[rowIndex][colIndex] = status;
          }
        });
      }
    });

    setGridStatus(initialStatus);
  }, [row, column]);

  return (
    <>
      <div className=" w-full flex gap-x-20 bg-gray-100 relative mt-[120px] min-h-[calc(100vh-120px)] px-4 py-12 sm:px-6 lg:mt-[8vh] lg:h-[92vh] lg:min-h-0 lg:px-0">
        {isPending && (
          <div className="fixed top-[5vh] left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[100] flex items-center justify-center">
            <div className=" w-[20%] h-[30vh] bg-white text-black text-2xl rounded-4xl flex flex-col justify-center items-center space-y-2">
              <div className="animate-pulse">計算中...</div>
              <div className="text-gray-400 text-lg">已用時 {usedTime} 秒</div>
            </div>
          </div>
        )}
        <div className="w-[50%] mt-5 h-fit ml-20">
          <ShiftArea
            constraints={constraints}
            setConstraints={setConstraints}
            gridStatus={gridStatus}
            setGridStatus={setGridStatus}
            isModify={isModify}
            setModify={setModify}
            refresh={() => refresh(GenerateWorkerData(returnData))}
            toWs={(e) => {
              startTransition(() => {
                // toWS(e);
              });
            }}
            name={name}
            column={column}
            data={GenerateWorkerData(returnData)}
          ></ShiftArea>
        </div>
        <div className=" w-[100%] mt-5 h-fit">
          <AttributePanel
            constraints={constraints}
            setConstraints={setConstraints}
            gridStatus={gridStatus}
            setRow={setRow}
            setColumn={setColumn}
            row={row}
            column={column}
          ></AttributePanel>
        </div>
      </div>
    </>
  );
}
