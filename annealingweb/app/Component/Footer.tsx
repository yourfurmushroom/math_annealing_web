import Image from "next/image";

export default function Footer()
{
    return(
        <div className=" bg-gray-700 h-[30vh] w-full p-5  overflow-hidden flex justify-center">
            <div className="mx-10 text-white">
                <ul className=" ">
                <li>資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊</li>
                <li>資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊</li>
                <li>資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊</li>
                <li>資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊</li>
                <li>資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊資訊</li>
                <li className=" translate-y-[-30%]">
                    <Image width={400} height={50} alt="國家科學及技術委員會" src="/nstc_logo.png"/>
                </li>
                </ul>

            </div>
        </div>
    )
}