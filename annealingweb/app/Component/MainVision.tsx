export default function MainVision() {
  return (
    // <div className="w-full h-[92vh] relative bg-[url('https://www.quantumtaiwan.org/tw/uploads/nc_vision/14/69d464a865343.jpg')] bg-cover bg-center bg-no-repeat">
    <div className="relative mt-[120px] min-h-[calc(100vh-120px)] w-full bg-black px-4 py-12 sm:px-6 lg:mt-[8vh] lg:h-[92vh] lg:min-h-0 lg:px-0">
      <div className="text-white text-[42px] sm:text-[64px] lg:text-[96px]">
        <p className="title-fade-in delay1">
          數位退火研發推動計畫
        </p>
        <p className="title-fade-in delay2">
          Pilot Research Programs <br />of Digital Annealers
        </p>
      </div>

      <a href="#mainContent" title="READ MORE" className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center cursor-pointer">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center animate-mouse-bounce">
          <div className="w-1 h-2 bg-white mt-2">

          </div>
        </div>
        <div className="w-[1px] h-10 bg-white mt-2 animate-scroll-line">

        </div>
      </a>

    </div>
  )
}
