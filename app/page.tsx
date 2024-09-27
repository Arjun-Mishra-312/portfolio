import {Intro} from "@/components/Hero";
import { TypewriterEffectSmoothDemo } from "@/components/contact";
import { Experiences } from "@/components/experiences";
import Projects from "@/components/projects";
import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-cards";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TimelineDemo } from "@/components/ui/timeline";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import Image from "next/image";


export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <main className="w-full relative bg-black-100 flex justify-center 
    items-center flex-col overflow-hidden scroll-smooth ">
      <div className="max-2-7xl w-full justify-centers items-center flex flex-col">
      {/* <FloatingNav navItems={navItems} /> */}
        <Intro />
        <TextGenerateEffect words="Skills | Hover to Reveal" className="pt-10"/>
        <CanvasRevealEffectDemo />
        <TextGenerateEffect words="Experiences" />
        <TimelineDemo />
        <Projects/>
        <TypewriterEffectSmoothDemo />
      </div>
    </main>
    // <Hero />
  );
}
