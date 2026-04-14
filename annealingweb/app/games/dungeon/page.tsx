'use client'
/* eslint-disable */
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [progress, setProgress] = useState<number>(0); // 儲存載入進度
    const [isUnityLoaded, setIsUnityLoaded] = useState<boolean>(false); // 追蹤 Unity 是否載入完成

  

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
                    setProgress(progress); // 更新進度
                    console.log(`Loading: ${Math.round(progress * 100)}%`);
                }).then((unityInstance: any) => {
                    console.log("Unity loaded!");
                    setIsUnityLoaded(true); // 標記 Unity 載入完成
                }).catch((err: any) => {
                    console.error("Unity error:", err);
                    setIsUnityLoaded(true); // 即使出錯也隱藏進度條
                });
            };
            document.body.appendChild(script);
        };

        loadUnity();
    }, []);

    return (
        <>
            <div id="unity-container" className="unity-desktop flex justify-center pt-[100px] " style={{ position: 'relative' }}>
                {!isUnityLoaded && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            zIndex: 10,
                        }}
                    >
                        <p>Loading Unity: {Math.round(progress * 100)}%</p>
                        <div
                            style={{
                                width: '50%',
                                height: '20px',
                                background: '#ccc',
                                borderRadius: '10px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: `${progress * 100}%`,
                                    height: '100%',
                                    background: '#4caf50',
                                    transition: 'width 0.3s ease-in-out',
                                }}
                            ></div>
                        </div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    id="unity-canvas"
                    width={1400}
                    height={800}
                    style={{ background: "#231F20", display: isUnityLoaded ? 'block' : 'none' }}
                    tabIndex={-1}
                ></canvas>
            </div>
        </>
    );
}