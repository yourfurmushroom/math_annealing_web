import Image from "next/image";

export default function Home() {
  return (
    <div className=" w-full">
        <MainVision></MainVision>
    </div>
  );
}


function MainVision()
{
  return(
    // <AnimateMotion >
      <div className=" w-full h-[90vh] bg-black" >
      </div>
    // </AnimateMotion> 

  )
}