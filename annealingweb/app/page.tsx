'use client'
import { useState } from "react";
import MainVision from "./Component/MainVision";
import MainContent from "./Component/MainContent";

export default function Home() {
  return (
    <div className=" w-full">
      <MainVision></MainVision>
      <MainContent></MainContent>
    </div>
  );
}




