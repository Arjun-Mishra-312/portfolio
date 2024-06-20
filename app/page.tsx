import Hero from "@/components/Hero";
import Checking from "@/components/checking";
import { TypewriterEffectSmoothDemo } from "@/components/contact";
import { Experiences } from "@/components/experiences";
import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-cards";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";


export default function Home() {
  return (
    <main className="w-full relative bg-black-100 flex justify-center 
    items-center flex-col overflow-hidden ">
      <div className="max-2-7xl w-full justify-centers items-center flex flex-col">
        <Hero />
        <TextGenerateEffect words="Skills | Hover to Reveal" />
        <CanvasRevealEffectDemo />
        <TextGenerateEffect words="Experiences" />
        <Experiences />
        <Checking/>
        <TypewriterEffectSmoothDemo />
      </div>
    </main>
    // <Hero />
  );
}
