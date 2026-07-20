'use client'
import MainVision from "./Component/MainVision";
import MainContent from "./Component/MainContent";
import Footer from "./Component/Footer";

export default function Home() {
  return (
    <div className=" w-full">
      <MainVision></MainVision>
      <MainContent></MainContent>
      <Footer></Footer>
    </div>
  );
}




