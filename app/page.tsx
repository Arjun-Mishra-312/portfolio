import Hero from "@/components/Hero";
import Checking from "@/components/checking";
import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-cards";
import Image from "next/image";


export default function Home() {
  return (
    <main className="w-full relative bg-black-100 flex justify-center 
    items-center flex-col overflow-hidden ">
      <div className="max-2-7xl w-full">
        <Hero />
        <Checking/>
        <CanvasRevealEffectDemo />
        
      </div>
    </main>
    // <Hero />
  );
}
