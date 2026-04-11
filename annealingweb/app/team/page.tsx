import Image from "next/image";
import { member } from "../Data/member";

export default function Home() {
  return (
    <>
      <div className="relative mt-[120px] h-[20vh] w-full bg-[url('/background.jpg')] bg-no-repeat bg-cover lg:mt-[8vh]">
        <span className="absolute bottom-0 left-4 py-5 text-white font-bold text-[42px] sm:left-8 sm:text-[56px] lg:left-40 lg:text-[70px]">
          團隊成員
        </span>
      </div>
      {member.map((x,i)=><MemberCard key={i} imagePath={x.imagePath} labPath={x.labPath} subTitle={x.subTitle} name={x.name} position={x.position} otherPosition={x.otherPosition}></MemberCard>)}
    </>
  );
}

interface MemberCardProps{
  imagePath:string,
  labPath:string,
  subTitle:string,
  name:string,
  position:string,
  otherPosition:string[],
}
function MemberCard({imagePath,labPath,subTitle,name,position,otherPosition}:MemberCardProps)
{
  const memberImagePath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return (
    <div className="m-auto grid w-[90%] grid-cols-1 rounded-2xl bg-[rgba(128,128,128,0.2)] p-5 shadow-2xl md:grid-cols-[3fr_7fr] lg:h-[30vh]" >
      <div className="w-full p-5">
          <Image src={memberImagePath} alt={name} width={320} height={320} unoptimized className="w-full"></Image>
      </div>
      <div className="w-full p-5 grid gap-3 md:grid-rows-[1fr_2fr_7fr]">
        <section className="relative">
          <span className="text-blue-600 text-[24px] sm:text-[28px] lg:absolute lg:left-0 lg:bottom-2 lg:text-[32px]">{subTitle}</span>
        </section>
        <section className="relative">
          <a href={labPath} target="_blank" className="inline-block text-[32px] mr-5 font-bold cursor-pointer hover:text-blue-500 hover:scale-105 focus:text-gray-800 duration-300 ease-in-out lg:text-[45px]" rel="noopener noreferrer">{name}</a>
          <span className="block text-[24px] sm:inline lg:text-[32px]">{position}</span>
        <hr/>
        </section>
        <section className="text-[18px] sm:text-[20px]">
          現任:<br/>
          <span className="">
          {otherPosition.map((x,i)=><div key={i}>{x}<br/></div>)}
          </span>
        </section>
          
      </div>
    </div>
  )
}
