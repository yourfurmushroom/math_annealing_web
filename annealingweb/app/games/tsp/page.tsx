'use client'
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    const [numNodes, setNumNodes] = useState<number>(5);
    const [houses, setHouses] = useState<{ x: number, y: number, image: string }[]>([]);
    const [currentPath, setCurrentPath] = useState<number[]>([]);
    const [currentDistance, setCurrentDistance] = useState<number>(0);
    const [distances, setDistances] = useState<number[][]>([]);
    const [iterationSpeed, setIterationSpeed] = useState<number>(500);
    const [startPoint, setStartPoint] = useState<number | null>(null);

    const [panelPosition, setPanelPosition] = useState<{ x: number, y: number }>({ x: 10, y: 10 });
    const [isDraggingPanel, setIsDraggingPanel] = useState<boolean>(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [draggingHouse, setDraggingHouse] = useState<number | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState<Map<number, HTMLImageElement>>(new Map());

    const initialTemp = 1000;
    const coolingRate = 0.995;
    const [temperature, setTemperature] = useState(initialTemp);

    const numImages = 10;
    const imageSize = 50;

    const calculatePathDistance = (path: number[], dists: number[][]): number => {
        let dist = 0;
        for (let i = 0; i < path.length; i++) {
            dist += dists[path[i]][path[(i + 1) % path.length]];
        }
        return dist;
    };

    const loadImagesAndInitialize = async () => {
        const imageMap = new Map<number, HTMLImageElement>();

        for (let i = 1; i <= numImages; i++) {
            const img = new Image();
            img.src = `/images/${i}.png`;

            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = () => {
                    console.error(`Failed to load image: /images/${i}.png`);
                    resolve(null);
                };
            });

            imageMap.set(i, img);
        }

        setImagesLoaded(imageMap);

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const width = window.innerWidth;
            const height = window.innerHeight - 300;

            canvas.width = width;
            canvas.height = height;

            const newHouses = Array.from({ length: numNodes }, () => ({
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
                image: `/images/${Math.floor(Math.random() * numImages) + 1}.png`
            }));

            setHouses(newHouses);

            const newDistances = newHouses.map((h1, i) =>
                newHouses.map((h2, j) => {
                    if (i === j) return 0;
                    return Math.round(
                        Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2))
                    );
                })
            );

            setDistances(newDistances);

            let initialPath = Array.from({ length: numNodes }, (_, i) => i).sort(() => Math.random() - 0.5);

            if (startPoint !== null && startPoint < numNodes) {
                const idx = initialPath.indexOf(startPoint);
                if (idx !== -1) {
                    initialPath.splice(idx, 1);
                    initialPath = [startPoint, ...initialPath];
                }
            } else if (startPoint !== null) {
                setStartPoint(null);
            }

            setCurrentPath(initialPath);
            setCurrentDistance(calculatePathDistance(initialPath, newDistances));
            setTemperature(initialTemp);
        }
    };

    useEffect(() => {
        loadImagesAndInitialize();
    }, [numNodes]);

    const initialize = () => {
        setImagesLoaded(new Map());
        setHouses([]);
        loadImagesAndInitialize();
    };

    const performSAIteration = () => {
        if (currentPath.length === 0 || distances.length === 0) return;

        let newPath = [...currentPath];

        let idx1 = startPoint !== null
            ? Math.floor(Math.random() * (numNodes - 1)) + 1
            : Math.floor(Math.random() * numNodes);

        let idx2 = startPoint !== null
            ? Math.floor(Math.random() * (numNodes - 1)) + 1
            : Math.floor(Math.random() * numNodes);

        while (idx1 === idx2) {
            idx2 = startPoint !== null
                ? Math.floor(Math.random() * (numNodes - 1)) + 1
                : Math.floor(Math.random() * numNodes);
        }

        [newPath[idx1], newPath[idx2]] = [newPath[idx2], newPath[idx1]];

        const newDist = calculatePathDistance(newPath, distances);
        const delta = newDist - currentDistance;

        if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
            setCurrentPath(newPath);
            setCurrentDistance(newDist);
        }

        setTemperature(prev => prev * coolingRate);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            performSAIteration();
        }, iterationSpeed);

        return () => clearInterval(interval);
    }, [currentPath, currentDistance, temperature, distances, iterationSpeed, startPoint, numNodes]);

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            let closestIdx = -1;
            let minDist = Infinity;

            houses.forEach((house, idx) => {
                if (!house) return;
                const dist = Math.sqrt(Math.pow(house.x - clickX, 2) + Math.pow(house.y - clickY, 2));
                if (dist < minDist && dist < (imageSize / 2 + 10)) {
                    minDist = dist;
                    closestIdx = idx;
                }
            });

            if (closestIdx !== -1) {
                setDraggingHouse(closestIdx);
                setDragOffset({
                    x: clickX - houses[closestIdx].x,
                    y: clickY - houses[closestIdx].y
                });
            }
        }
    };

    const handleCanvasMouseMove = (event: MouseEvent) => {
        if (draggingHouse !== null && canvasRef.current && houses[draggingHouse]) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const newHouses = [...houses];
            newHouses[draggingHouse] = {
                ...newHouses[draggingHouse],
                x: mouseX - dragOffset.x,
                y: mouseY - dragOffset.y
            };

            setHouses(newHouses);
        }
    };

    const handleCanvasMouseUp = () => {
        if (draggingHouse !== null && houses[draggingHouse]) {
            const newDistances = houses.map((h1, i) =>
                houses.map((h2, j) => {
                    if (i === j) return 0;
                    return Math.round(
                        Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2))
                    );
                })
            );

            setDistances(newDistances);

            let newPath = Array.from({ length: numNodes }, (_, i) => i).sort(() => Math.random() - 0.5);

            if (startPoint !== null) {
                const idx = newPath.indexOf(startPoint);
                if (idx !== -1) {
                    newPath.splice(idx, 1);
                    newPath = [startPoint, ...newPath];
                }
            }

            setCurrentPath(newPath);
            setCurrentDistance(calculatePathDistance(newPath, newDistances));
            setTemperature(initialTemp);
            setDraggingHouse(null);
        }
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggingHouse === null && canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            let closestIdx = -1;
            let minDist = Infinity;

            houses.forEach((house, idx) => {
                if (!house) return;
                const dist = Math.sqrt(Math.pow(house.x - clickX, 2) + Math.pow(house.y - clickY, 2));
                if (dist < minDist && dist < (imageSize / 2 + 10)) {
                    minDist = dist;
                    closestIdx = idx;
                }
            });

            if (closestIdx !== -1) {
                setStartPoint(closestIdx);
                const newPath = [
                    closestIdx,
                    ...Array.from({ length: numNodes }, (_, i) => i)
                        .filter(i => i !== closestIdx)
                        .sort(() => Math.random() - 0.5)
                ];
                setCurrentPath(newPath);
                setCurrentDistance(calculatePathDistance(newPath, distances));
                setTemperature(initialTemp);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleCanvasMouseMove);
        window.addEventListener('mouseup', handleCanvasMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleCanvasMouseMove);
            window.removeEventListener('mouseup', handleCanvasMouseUp);
        };
    }, [draggingHouse, dragOffset, houses, distances, startPoint, numNodes]);

    const handlePanelMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest('.panel-toggle-btn')) {
            return;
        }

        if (target.closest('.draggable-navbar')) {
            setIsDraggingPanel(true);
            setDragOffset({
                x: event.clientX - panelPosition.x,
                y: event.clientY - panelPosition.y
            });
        }
    };

    const handlePanelMouseMove = (event: MouseEvent) => {
        if (isDraggingPanel) {
            setPanelPosition({
                x: event.clientX - dragOffset.x,
                y: event.clientY - dragOffset.y
            });
        }
    };

    const handlePanelMouseUp = () => {
        setIsDraggingPanel(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handlePanelMouseMove);
        window.addEventListener('mouseup', handlePanelMouseUp);

        return () => {
            window.removeEventListener('mousemove', handlePanelMouseMove);
            window.removeEventListener('mouseup', handlePanelMouseUp);
        };
    }, [isDraggingPanel, dragOffset]);

    useEffect(() => {
        if (canvasRef.current && houses.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (numNodes <= 8) {
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 1;

                for (let i = 0; i < numNodes; i++) {
                    for (let j = i + 1; j < numNodes; j++) {
                        if (!houses[i] || !houses[j]) continue;

                        ctx.beginPath();
                        ctx.moveTo(houses[i].x, houses[i].y);
                        ctx.lineTo(houses[j].x, houses[j].y);
                        ctx.stroke();

                        const midX = (houses[i].x + houses[j].x) / 2;
                        const midY = (houses[i].y + houses[j].y) / 2;
                        ctx.fillStyle = 'black';
                        ctx.font = '12px Arial';
                        ctx.fillText(distances[i][j].toString(), midX, midY);
                    }
                }
            }

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;

            for (let i = 0; i < currentPath.length; i++) {
                const from = currentPath[i];
                const to = currentPath[(i + 1) % currentPath.length];
                if (!houses[from] || !houses[to]) continue;

                ctx.beginPath();
                ctx.moveTo(houses[from].x, houses[from].y);
                ctx.lineTo(houses[to].x, houses[to].y);
                ctx.stroke();
            }

            houses.forEach((house, idx) => {
                if (!house || typeof house.x === 'undefined' || typeof house.y === 'undefined') {
                    console.warn(`House at index ${idx} is invalid:`, house);
                    return;
                }

                const imageIndex = parseInt(house.image.match(/\/images\/(\d+)\.png/)?.[1] || '1');
                const img = imagesLoaded.get(imageIndex);

                if (img && img.complete && img.naturalWidth !== 0) {
                    ctx.drawImage(img, house.x - imageSize / 2, house.y - imageSize / 2, imageSize, imageSize);
                } else {
                    ctx.fillStyle = idx === startPoint ? 'green' : (idx === draggingHouse ? 'yellow' : 'blue');
                    ctx.beginPath();
                    ctx.arc(house.x, house.y, imageSize / 2, 0, 2 * Math.PI);
                    ctx.fill();
                }

                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.fillText((idx + 1).toString(), house.x - 5, house.y + imageSize / 2 + 10);

                if (idx === startPoint) {
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(house.x - imageSize / 2, house.y - imageSize / 2, imageSize, imageSize);
                } else if (idx === draggingHouse) {
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(house.x - imageSize / 2, house.y - imageSize / 2, imageSize, imageSize);
                }
            });
        }
    }, [houses, currentPath, distances, startPoint, draggingHouse, numNodes, imagesLoaded]);

    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseInt(event.target.value);
        setIterationSpeed(newSpeed);
    };

    const handleNumNodesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNum = parseInt(event.target.value);
        setNumNodes(newNum);

        if (startPoint !== null && startPoint >= newNum) {
            setStartPoint(null);
        }
    };

    return (
        <>
            <div className="relative mt-[120px] min-h-[calc(100vh-120px)] w-full bg-black px-4 py-12 sm:px-6 lg:mt-[8vh] lg:h-[92vh] lg:min-h-0 lg:px-0"
                style={{
                    position: 'relative',
                    backgroundImage: "url('/images/background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ display: 'block', zIndex: 10 }}
                    onClick={handleCanvasClick}
                    onMouseDown={handleCanvasMouseDown}
                />

                <div
                    style={{
                        position: 'absolute',
                        left: `${panelPosition.x}px`,
                        top: `${panelPosition.y}px`,
                        background: 'white',
                        padding: isPanelCollapsed ? '0' : '0 10px 10px 10px',
                        border: '1px solid black',
                        zIndex: 10,
                        userSelect: 'none',
                        minWidth: '280px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                    onMouseDown={handlePanelMouseDown}
                >
                    <div
                        className="draggable-navbar"
                        style={{
                            background: '#4a4a4a',
                            color: 'white',
                            padding: '8px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: isDraggingPanel ? 'grabbing' : 'grab',
                            fontWeight: 'bold'
                        }}
                    >
                        <span>Control Panel</span>

                        <button
                            type="button"
                            className="panel-toggle-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPanelCollapsed(prev => !prev);
                            }}
                            style={{
                                marginLeft: '10px',
                                background: 'transparent',
                                border: '1px solid white',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '2px 8px',
                                cursor: 'pointer'
                            }}
                        >
                            {isPanelCollapsed ? '展開' : '收縮'}
                        </button>
                    </div>

                    {!isPanelCollapsed && (
                        <div style={{ marginTop: '10px' }}>
                            <p>
                                Current Path:{" "}
                                {currentPath.length > 0
                                    ? `${currentPath.map(i => i + 1).join(' -> ')} -> ${currentPath[0] + 1}`
                                    : 'N/A'}
                            </p>
                            <p>Total Distance: {currentDistance}</p>
                            <p>Temperature: {temperature.toFixed(2)}</p>
                            <p>Start Point: {startPoint !== null ? startPoint + 1 : 'Not set'}</p>

                            <div style={{ marginTop: '10px' }}>
                                <label>Iteration Speed (ms): </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="2000"
                                    step="1"
                                    value={iterationSpeed}
                                    onChange={handleSpeedChange}
                                    style={{ width: '100%' }}
                                />
                                <span>{iterationSpeed} ms</span>
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <label>Number of Nodes: </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="20"
                                    step="1"
                                    value={numNodes}
                                    onChange={handleNumNodesChange}
                                    style={{ width: '100%' }}
                                />
                                <span>{numNodes}</span>
                            </div>

                            <button
                                onClick={initialize}
                                style={{ marginTop: '10px',width:'50%' }}
                                className="border-2 border-gray-500 rounded-2xl shadow-2xl p-3 hover:bg-gray-200 ease-in-out duration-200 "
                            >
                                Reset and Randomize
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}