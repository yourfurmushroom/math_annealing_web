export default function MainVision() {
  return (
    // <div className="w-full h-[92vh] relative bg-[url('https://www.quantumtaiwan.org/tw/uploads/nc_vision/14/69d464a865343.jpg')] bg-cover bg-center bg-no-repeat">
    <div className="w-full h-[92vh] bg-black mt-[8vh]">
      <div className=" text-white text-[96px]">
        <p className="title-fade-in delay1">
          數位退火研發推動計畫
        </p>
        <p className="title-fade-in delay2 ">
          Pilot Research Programs <br />of Digital Annealers
        </p>
      </div>

      <a href="#mainContent" title="READ MORE" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer">
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