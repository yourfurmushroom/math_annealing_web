import Image from "next/image";

export default function MainVision() {
  return (
    // 1. 最外層容器：移除 py-12，讓 flex 完全接管垂直空間
    <div className="relative min-h-[calc(100vh_-_var(--navbar-offset))] w-full bg-black px-4 sm:px-6">
      <div className="flex min-h-[inherit] flex-col items-center justify-center text-center text-white pb-24">
        <Image
          src="/annealing/nstc_logo.png"
          alt="國家科學及技術委員會"
          width={500}
          height={107}
          priority
          className="title-fade-in mb-4 h-auto w-auto max-w-[640px] lg:mb-6"
        />

        {/* 4. 標題與副標題：建議主標題可以改用 <h1> 標籤對 SEO 比較好 */}
        <h1 className="title-fade-in delay1 text-[36px] font-bold sm:text-[56px] lg:text-[80px]">
          數位退火研發推動計畫
        </h1>
        <p className="title-fade-in delay2 mt-2 text-[20px] text-white/70 sm:text-[28px] lg:text-[36px]">
          Pilot Research Programs<br />of Digital Annealers
        </p>
      </div>

      {/* 5. 底部向下滾動提示 (Scroll Down Indicator) 保持不變 */}
      <a 
        href="#mainContent" 
        title="READ MORE" 
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center cursor-pointer"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center animate-mouse-bounce">
          <div className="w-1 h-2 bg-white mt-2 rounded-full"></div>
        </div>
        <div className="w-[1px] h-10 bg-white mt-2 animate-scroll-line"></div>
      </a>

    </div>
  );
}