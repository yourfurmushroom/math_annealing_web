import { member } from "../Data/member";

export default function Home() {
  return (
    <>
      <div className=" relative w-full mt-[8vh] bg-[url('/background.jpg')] h-[20vh] bg-no-repeat bg-cover">
        <span className="absolute left-40 bottom-0 py-5  text-white font-bold text-[70px] shadow-black">
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
  return (
    <div className="m-auto p-5 grid grid-cols-[3fr_7fr] w-[90%] h-[30vh] bg-[rgba(128,128,128,0.2)] rounded-2xl shadow-2xl" >
      <div className=" w-full p-5">
          <img src={imagePath}></img>
      </div>
      <div className=" w-full p-5 grid grid-rows-[1fr_2fr_7fr]">
        <section className="relative ">
          <span className="absolute left-0 bottom-2 text-blue-600 text-[32px] ">{subTitle}</span>
        </section>
        <section className="relative ">
          <a href={labPath} target="_blank" className="inline-block text-[45px] mr-5 font-bold cursor-pointer hover:text-blue-500 hover:scale-105 focus:text-gray-800 duration-300 ease-in-out" rel="noopener noreferrer">{name}</a>
          <span className="text-[32px] ">{position}</span>
        <hr/>
        </section>
        <section className="relative  text-[20px]">
          現任:<br/>
          <span className="">
          {otherPosition.map((x,i)=><div key={i}>{x}<br/></div>)}
          </span>
        </section>
          
      </div>
    </div>
  )
}