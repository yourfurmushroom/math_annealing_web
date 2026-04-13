'use client'
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isUnityLoaded, setIsUnityLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadUnity = async () => {
            const buildUrl = "/digitalAnnealing/Build";
            const loaderUrl = buildUrl + "/digitalAnnealing.loader.js";

            const config = {
                dataUrl: buildUrl + "/digitalAnnealing.data",
                frameworkUrl: buildUrl + "/digitalAnnealing.framework.js",
                codeUrl: buildUrl + "/digitalAnnealing.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "DefaultCompany",
                productName: "digitalAnnealing",
                productVersion: "1.0",
                showBanner: (msg: string, type: string) => {
                    console.warn(`[Unity ${type}]: ${msg}`);
                },
            };

            const script = document.createElement("script");
            script.src = loaderUrl;

            script.onload = () => {
                // @ts-ignore
                createUnityInstance(canvasRef.current, config, (progress: number) => {
                    setProgress(progress);
                    console.log(`Loading: ${Math.round(progress * 100)}%`);
                })
                    .then(() => {
                        console.log("Unity loaded!");
                        setIsUnityLoaded(true);
                    })
                    .catch((err: any) => {
                        console.error("Unity error:", err);
                        setIsUnityLoaded(true); // 跟你提供的版本一樣，出錯也先把遮罩拿掉
                    });
            };

            document.body.appendChild(script);
        };

        loadUnity();
    }, []);

    return (
        <div
            id="unity-container"
            className="relative flex min-h-[calc(100vh-120px)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:mt-[8vh] lg:h-[92vh] lg:min-h-0 lg:px-0"
        >
            {!isUnityLoaded && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        zIndex: 10,
                    }}
                >
                    <p>Loading Unity: {Math.round(progress * 100)}%</p>
                    <div
                        style={{
                            width: "50%",
                            height: "20px",
                            background: "#ccc",
                            borderRadius: "10px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress * 100}%`,
                                height: "100%",
                                background: "#4caf50",
                                transition: "width 0.3s ease-in-out",
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="flex w-full justify-center">
                <canvas
                    ref={canvasRef}
                    id="unity-canvas"
                    width={1300}
                    height={768}
                    style={{
                        background: "#231F20",
                        display: isUnityLoaded ? "block" : "none",
                    }}
                    className="h-auto max-h-[80vh] w-auto max-w-[calc(100vw-2rem)]"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
}