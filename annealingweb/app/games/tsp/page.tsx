'use client'
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Refs mirroring the latest state, so long-lived listeners (ResizeObserver,
    // setInterval) never read stale closures.
    const housesRef = useRef<{ x: number, y: number, image: string }[]>([]);
    const currentPathRef = useRef<number[]>([]);
    const didDragRef = useRef<boolean>(false);

    const initialTemp = 1000;
    const coolingRate = 0.995;
    const [temperature, setTemperature] = useState(initialTemp);

    const numImages = 10;
    const imageSize = 50;
    const nodeRadius = imageSize / 2;

    const clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max);
    };

    const getCanvasSize = () => {
        const container = containerRef.current;
        const width = Math.max(Math.floor(container?.clientWidth || window.innerWidth), imageSize * 2);
        const height = Math.max(Math.floor(container?.clientHeight || window.innerHeight), imageSize * 2);

        return { width, height };
    };

    const syncCanvasSize = () => {
        const canvas = canvasRef.current;
        const { width, height } = getCanvasSize();

        if (canvas && (canvas.width !== width || canvas.height !== height)) {
            canvas.width = width;
            canvas.height = height;
        }

        return { width, height };
    };

    const calculatePathDistance = (path: number[], dists: number[][]): number => {
        let dist = 0;
        for (let i = 0; i < path.length; i++) {
            dist += dists[path[i]]?.[path[(i + 1) % path.length]] ?? 0;
        }
        return dist;
    };

    const calculateDistances = (points: { x: number, y: number, image: string }[]) => {
        return points.map((h1, i) =>
            points.map((h2, j) => {
                if (i === j) return 0;
                return Math.round(
                    Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2))
                );
            })
        );
    };

    // Load node images once. numNodes changes must NOT re-trigger this,
    // otherwise overlapping async loads race and the last one to resolve
    // can overwrite houses with a stale numNodes.
    useEffect(() => {
        let cancelled = false;

        const loadImages = async () => {
            const imageMap = new Map<number, HTMLImageElement>();

            await Promise.all(
                Array.from({ length: numImages }, (_, k) => {
                    const i = k + 1;
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            imageMap.set(i, img);
                            resolve();
                        };
                        img.onerror = () => {
                            console.error(`Failed to load image: /images/${i}.png`);
                            resolve();
                        };
                        img.src = `/images/${i}.png`;
                    });
                })
            );

            if (!cancelled) {
                setImagesLoaded(imageMap);
            }
        };

        loadImages();

        return () => {
            cancelled = true;
        };
    }, []);

    const initializeBoard = () => {
        if (!canvasRef.current) return;

        const { width, height } = syncCanvasSize();

        const newHouses = Array.from({ length: numNodes }, () => ({
            x: Math.random() * Math.max(width - imageSize, 1) + nodeRadius,
            y: Math.random() * Math.max(height - imageSize, 1) + nodeRadius,
            image: `/images/${Math.floor(Math.random() * numImages) + 1}.png`
        }));

        setHouses(newHouses);

        const newDistances = calculateDistances(newHouses);
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
    };

    useEffect(() => {
        initializeBoard();
    }, [numNodes]);

    useEffect(() => {
        housesRef.current = houses;
    }, [houses]);

    useEffect(() => {
        currentPathRef.current = currentPath;
    }, [currentPath]);

    const initialize = () => {
        initializeBoard();
    };

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const resizeCanvas = () => {
            const previousWidth = canvas.width || container.clientWidth;
            const previousHeight = canvas.height || container.clientHeight;
            const { width, height } = syncCanvasSize();

            if (previousWidth === width && previousHeight === height) {
                return;
            }

            const prevHouses = housesRef.current;
            if (prevHouses.length === 0) return;

            const resizedHouses = prevHouses.map((house) => ({
                ...house,
                x: clamp((house.x / previousWidth) * width, nodeRadius, width - nodeRadius),
                y: clamp((house.y / previousHeight) * height, nodeRadius, height - nodeRadius),
            }));

            const newDistances = calculateDistances(resizedHouses);

            setHouses(resizedHouses);
            setDistances(newDistances);
            setCurrentDistance(calculatePathDistance(currentPathRef.current, newDistances));
        };

        resizeCanvas();

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(container);
        window.addEventListener('resize', resizeCanvas);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

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

    const performSARef = useRef(performSAIteration);
    useEffect(() => {
        performSARef.current = performSAIteration;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            performSARef.current();
        }, iterationSpeed);

        return () => clearInterval(interval);
    }, [iterationSpeed]);

    // Convert client coords to canvas backing-store coords. The canvas is
    // stretched by CSS (h-full w-full), so raw clientX/Y offsets are wrong
    // whenever the backing size and the displayed size differ.
    const getCanvasCoords = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
        const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const { x: clickX, y: clickY } = getCanvasCoords(event.clientX, event.clientY);

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
                didDragRef.current = false;
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
            const { x: mouseX, y: mouseY } = getCanvasCoords(event.clientX, event.clientY);

            didDragRef.current = true;

            const newHouses = [...houses];
            newHouses[draggingHouse] = {
                ...newHouses[draggingHouse],
                x: clamp(mouseX - dragOffset.x, nodeRadius, canvas.width - nodeRadius),
                y: clamp(mouseY - dragOffset.y, nodeRadius, canvas.height - nodeRadius)
            };

            setHouses(newHouses);
        }
    };

    const handleCanvasMouseUp = () => {
        if (draggingHouse === null) return;

        // Only rebuild distances/path when the house actually moved.
        // A plain click (mousedown + mouseup without movement) should not
        // re-randomize the path — it falls through to handleCanvasClick,
        // which sets the start point.
        if (didDragRef.current && houses[draggingHouse]) {
            const newDistances = calculateDistances(houses);

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
        }

        setDraggingHouse(null);
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // Ignore the click that ends a drag.
        if (didDragRef.current) return;

        if (canvasRef.current) {
            const { x: clickX, y: clickY } = getCanvasCoords(event.clientX, event.clientY);

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
            <div
                ref={containerRef}
                className="relative min-h-[calc(100vh_-_var(--navbar-offset))] w-full overflow-hidden bg-black lg:h-[calc(100vh_-_var(--navbar-offset))] lg:min-h-0"
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
                    className="absolute inset-0 h-full w-full"
                    style={{ display: 'block', zIndex: 0 }}
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
