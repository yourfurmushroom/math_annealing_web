'use client'
import React, { useEffect, useState, startTransition } from "react";
import ShiftArea from "./Component/ShiftArea";
import AttributePanel from "./Component/AttributePanel";
import { Constraint } from "./Component/Utilities";

interface WorkerData {
  name: string;
  status: string[];
}

function generateWorkerData(returnData: string, row: number, column: number) {
  let parsed: WorkerData[] = [];

  try {
    const value: unknown = JSON.parse(returnData);
    if (Array.isArray(value)) {
      parsed = value.map((worker, index) => {
        if (!worker || typeof worker !== "object") {
          return {
            name: `Worker ${index + 1}`,
            status: Array(column).fill("上班"),
          };
        }

        const record = worker as Record<string, unknown>;
        return {
          name: typeof record.name === "string" ? record.name : `Worker ${index + 1}`,
          status: Array.isArray(record.status)
            ? record.status.map((status) => String(status))
            : Array(column).fill("上班"),
        };
      });
    }
  } catch (error) {
    console.error("Error parsing JSON data:", error);
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

  return parsed.map((worker) => {
    const status = [...worker.status];
    if (status.length > column) {
      status.length = column;
    } else if (status.length < column) {
      status.push(...Array(column - status.length).fill("上班"));
    }
    return { ...worker, status };
  });
}

function buildGridStatus(parsed: WorkerData[], row: number, column: number) {
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

  return initialStatus;
}

function parseAsArray(value: string): string | null {
  try {
    return Array.isArray(JSON.parse(value)) ? value : null;
  } catch {
    return null;
  }
}

// Only accept values that really are (or parse to) a schedule array.
// Never fall back to human-readable fields like `message`, otherwise a
// string such as "Data saved" ends up in returnData, fails JSON.parse,
// and wipes the whole grid back to default.
function extractReturnData(result: unknown) {
  if (Array.isArray(result)) {
    return JSON.stringify(result);
  }

  if (typeof result === "string") {
    return parseAsArray(result);
  }

  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    const data = record.data ?? record.result;
    if (Array.isArray(data)) {
      return JSON.stringify(data);
    }
    if (typeof data === "string") {
      return parseAsArray(data);
    }
  }

  return null;
}

export default function Dashboard() {
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(30);
  const [name] = useState<string>("untitled");
  const [isModify, setModify] = useState<boolean>(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [gridStatus, setGridStatus] = useState<string[][]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [usedTime,setUsedTime]=useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [returnData, setReturnData] = useState<string>("[]");
  const workerData = generateWorkerData(returnData, row, column);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  function toFriendlyError(error: unknown) {
    const raw = error instanceof Error ? error.message : "";
    if (/fetch failed|ECONNREFUSED|Failed to fetch|NetworkError/i.test(raw)) {
      return "無法連線到計算後端，請確認後端服務已啟動";
    }
    return raw || "發生未知錯誤";
  }

  async function ToCGA(data:string)
  {
    let message: Record<string, unknown>;
    try {
      message = JSON.parse(data);
    } catch {
      setErrorMsg("排班資料格式錯誤，無法送出");
      return;
    }

    const action = typeof message.action === "string" ? message.action : "";

    if (!Array.isArray(message.data) || message.data.length === 0) {
      setErrorMsg(action === "Save" ? "目前沒有班表可保存，請先設定員工數量" : "請先設定員工數量再計算");
      return;
    }

    setErrorMsg(null);
    setNotice(null);
    setUsedTime(0);
    setIsPending(true);

    try {
      const res=await fetch('/api/toCGA',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ message })
      })

      const result: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const detail = result && typeof result === "object" && "error" in result
          ? String((result as Record<string, unknown>).error)
          : "";
        throw new Error(detail || `伺服器錯誤 (${res.status})`);
      }

      if (action === "Save") {
        // /save 回傳 {message, result}，不含班表資料，不能拿去更新 grid。
        setNotice("班表已保存");
        return;
      }

      const nextReturnData = extractReturnData(result);
      if (nextReturnData !== null) {
        setReturnData(nextReturnData);
        setGridStatus(buildGridStatus(generateWorkerData(nextReturnData, row, column), row, column));
        setNotice("計算完成");
      } else {
        throw new Error("後端回傳格式不正確，未更新班表");
      }
    } catch (error) {
      console.error("toCGA request failed:", error);
      setErrorMsg(toFriendlyError(error));
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const timer = setInterval(() => {
      setUsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isPending]);

  const refresh = (parsed: WorkerData[]) => {
    setGridStatus(buildGridStatus(parsed, row, column));
  };

  const handleRowChange = (nextRow: number) => {
    setRow(nextRow);
    setGridStatus(buildGridStatus(generateWorkerData(returnData, nextRow, column), nextRow, column));
  };

  const handleColumnChange = (nextColumn: number) => {
    setColumn(nextColumn);
    setGridStatus(buildGridStatus(generateWorkerData(returnData, row, nextColumn), row, nextColumn));
  };

  return (
    <>
      <div className=" w-full flex gap-x-20 bg-gray-100 relative min-h-[calc(100vh_-_var(--navbar-offset))] px-4 py-12 sm:px-6 lg:h-[calc(100vh_-_var(--navbar-offset))] lg:min-h-0 lg:px-0">
        {isPending && (
          <div className="fixed inset-x-0 bottom-0 top-[var(--navbar-offset)] bg-[rgba(0,0,0,0.7)] z-[100] flex items-center justify-center">
            <div className=" w-[20%] h-[30vh] bg-white text-black text-2xl rounded-4xl flex flex-col justify-center items-center space-y-2">
              <div className="animate-pulse">計算中...</div>
              <div className="text-gray-400 text-lg">已用時 {usedTime} 秒</div>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="fixed left-1/2 top-[calc(var(--navbar-offset)+12px)] z-[110] flex max-w-[90vw] -translate-x-1/2 items-center gap-x-4 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg">
            <span>{errorMsg}</span>
            <button
              type="button"
              aria-label="關閉錯誤訊息"
              className="shrink-0 font-bold"
              onClick={() => setErrorMsg(null)}
            >
              ×
            </button>
          </div>
        )}
        {notice && !errorMsg && (
          <div className="fixed left-1/2 top-[calc(var(--navbar-offset)+12px)] z-[110] max-w-[90vw] -translate-x-1/2 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg">
            {notice}
          </div>
        )}
        <div className="w-[50%] mt-5 h-fit ml-20">
          <ShiftArea
            constraints={constraints}
            gridStatus={gridStatus}
            setGridStatus={setGridStatus}
            isModify={isModify}
            setModify={setModify}
            refresh={() => refresh(workerData)}
            toWs={(e) => {
              startTransition(() => {
                ToCGA(e);
              });
            }}
            name={name}
            column={column}
            data={workerData}
          ></ShiftArea>
        </div>
        <div className=" w-[100%] mt-5 h-fit">
          <AttributePanel
            constraints={constraints}
            setConstraints={setConstraints}
            gridStatus={gridStatus}
            setRow={handleRowChange}
            setColumn={handleColumnChange}
            row={row}
            column={column}
          ></AttributePanel>
        </div>
      </div>
    </>
  );
}
