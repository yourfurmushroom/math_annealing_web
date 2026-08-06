'use client'
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState<number>(0); // 儲存載入進度
    const [isUnityLoaded, setIsUnityLoaded] = useState<boolean>(false); // 追蹤 Unity 是否載入完成
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let unityInstance: any = null;
        // 先抓住 canvas 元素：unmount 時 canvasRef.current 會先被 React 清成 null
        const canvasEl = canvasRef.current;

        const buildUrl = "/annealing/digitalAnnealing/Build";
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
            if (cancelled || !canvasEl) return;
            // @ts-ignore
            createUnityInstance(canvasEl, config, (progress: number) => {
                if (!cancelled) setProgress(progress);
            }).then((instance: any) => {
                unityInstance = instance;
                if (cancelled) {
                    // 頁面已離開，直接關掉剛載好的 instance
                    instance?.Quit?.().catch?.(() => { });
                    return;
                }
                console.log("Unity loaded!");
                setIsUnityLoaded(true);
            }).catch((err: any) => {
                console.error("Unity error:", err);
                if (!cancelled) {
                    setLoadError("Unity 載入失敗，請重新整理頁面再試");
                    setIsUnityLoaded(true); // 隱藏進度條
                }
            });
        };
        script.onerror = () => {
            if (!cancelled) {
                setLoadError("無法載入 Unity loader，請確認網路後重新整理");
                setIsUnityLoaded(true);
            }
        };
        document.body.appendChild(script);

        return () => {
            // 離開頁面時清理，避免重複進入時疊出第二個 instance / WebGL context 洩漏
            cancelled = true;
            script.remove();

            if (!unityInstance) return;

            // React 會立刻把 canvas 從 DOM 移除，但 Unity 的 main loop 要等 Quit()
            // 跑完才停，期間 emscripten 還會去找 canvas（wheel callback 等），
            // 找不到就丟 "Cannot read properties of null" 錯誤。
            // 先把 canvas 藏起來塞回 document.body，等 Quit 完成後再真正移除。
            if (canvasEl) {
                canvasEl.style.display = "none";
                document.body.appendChild(canvasEl);
            }

            const finalize = () => {
                canvasEl?.remove();
            };

            try {
                const quitResult = unityInstance.Quit?.();
                if (quitResult && typeof quitResult.then === "function") {
                    quitResult.then(finalize, finalize);
                } else {
                    finalize();
                }
            } catch {
                finalize();
            }
        };
    }, []);

    return (
        <>
            <div id="unity-container" className="unity-desktop flex justify-center" style={{ position: 'relative' }}>
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
                {loadError && (
                    <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg">
                        {loadError}
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    id="unity-canvas"
                    width={1400}
                    height={800}
                    style={{
                        background: "#231F20",
                        display: 'block',
                        width: '100%',
                        maxWidth: '1400px',
                        height: 'auto',
                        aspectRatio: '1400 / 800',
                    }}
                    tabIndex={-1}
                ></canvas>
            </div>
        </>
    );
}
