"use client";
import React from "react";

import { AnimatePresence, color, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

import {
  IconBrandReact,
  IconBrandGithub,
  IconBrandFlutter,
  IconBrandFigma,
  IconBrandThreejs,
  IconBrandBlender,
  IconBrandCpp,
  IconBrandPython,
  IconBrandJavascript,
  IconHtml,
  IconBrandTypescript,
  IconHexagonLetterJ,
  IconHexagonLetterC,
  IconHexagonLetterE,
  IconAssembly,
  IconPrompt,
  IconBrandFirebase,
  IconBrandTailwind,
  IconBrandNodejs,
  IconBrandMongodb,
  IconBrandNextjs,
  IconCloudCode,
} from "@tabler/icons-react";
import { Meteors } from "./meteors";

export function CanvasRevealEffectDemo() {
  return (
    <>
      <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-black-100 w-full gap-4 mx-auto px-8">
        <Card skills={frontend} icon="Frontend" bgColor="#059669">
          <CanvasRevealEffect
            animationSpeed={0}
            containerClassName="bg-emerald-600"
          />
        </Card>
        <Card skills={backend} icon="Backend" bgColor="#06b6d4">
          <CanvasRevealEffect
            animationSpeed={0}
            containerClassName="bg-cyan-500"
            
            // dotSize={2}
          />

          {/* Radial gradient for the cute fade */}
          {/* <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-gray-900 dark:gray-900" /> */}
        </Card>
        <Card skills={others} icon="Languages & Addional Skills" bgColor="#0ea5e9">
          <CanvasRevealEffect
            animationSpeed={0}
            containerClassName="bg-sky-500"
          />
        </Card>
      </div>
    </>
  );
}

export const frontend = [
  {
    title: "React.js",
    icon: <IconBrandReact style={{color: "#61DAFB"}} stroke={2} />,
    bgColor: "#61DAFB",
  },
  {
    title: "Flutter",
    icon: <IconBrandFlutter style={{color: "#06d2ff"}} stroke={2} />,
    bgColor: "#06d2ff",
  },
  {
    title: "Figma",
    icon: <IconBrandFigma style={{color: "#F24E1E"}} stroke={2} />,
    bgColor: "#F24E1E",
  },
  {
    title: "Three.js",
    icon: <IconBrandThreejs style={{color: "#FAFAFA"}} stroke={2} />,
    bgColor: "#FAFAFA",
  },
  {
    title: "Blender",
    icon: <IconBrandBlender style={{color:"#F5792A"}} stroke={2} />,
    bgColor: "#F5792A",
  },
  {
    title: "Tailwind",
    icon: <IconBrandTailwind style={{color:"#06B6D4"}} stroke={2} />,
    bgColor: "#06B6D4",
  },
  {
    title: "Next.js",
    icon: <IconBrandNextjs style={{color:"#ffaa06"}} stroke={2} />,
    bgColor: "#ffaa06",
  },
];

export const backend = [
  {
    title: "Firebase",
    icon: <IconBrandFirebase style={{color:"#FFCA28"}} stroke={2} />,
    bgColor: "#FFCA28",
  },
  {
    title: "Node.js",
    icon: <IconBrandNodejs style={{color:"#56f42f"}} stroke={2} />,
    bgColor: "#56f42f",
  },
  {
    title: "MongoDB",
    icon: <IconBrandMongodb style={{color:"#37df0d"}} stroke={2} />,
    bgColor: "#37df0d",
  },
  {
    title: "Google Cloud",
    icon: <IconCloudCode style={{color:"#32a9ff"}} stroke={2} />,
    bgColor: "#32a9ff",
  },
  {
    title: "Express.js",
    icon: <IconHexagonLetterE style={{color:"#FAFAFA"}} stroke={2} />,
    bgColor: "#FAFAFA",
  },
];

export const others = [
  {
    title: "C",
    icon: <IconHexagonLetterC style={{color:"#FAFAFA"}} stroke={2} />,
    bgColor: "#FAFAFA",
  },
  {
    title: "C++",
    icon: <IconBrandCpp style={{color:"#F24E1E"}} stroke={2} />,
    bgColor: "#F24E1E",
  },
  {
    title: "Dart",
    icon: <IconBrandFlutter style={{color:"#06d2ff"}} stroke={2} />,
    bgColor: "#06d2ff",
  },
  {
    title: "JavaScript",
    icon: <IconBrandJavascript style={{color:"#F7DF1E"}} stroke={2} />,
    bgColor: "#F7DF1E",
  },
  {
    title: "Java",
    icon: <IconHexagonLetterJ style={{color:"#F5792A"}} stroke={2} />,
    bgColor: "#F5792A",
  },
  {
    title: "Python",
    icon: <IconBrandPython style={{color:"#31f3ff"}} stroke={2} />,
    bgColor: "#31f3ff",
  },
  {
    title: "Assembly",
    icon: <IconAssembly style={{color:"#a56315"}} stroke={2} />,
    bgColor: "#a56315",
  },
  {
    title: "Typescript",
    icon: <IconBrandTypescript style={{color:"#a54915"}} stroke={2} />,
    bgColor: "#a54915",
  },
  {
    title: "HTML",
    icon: <IconHtml style={{color:"#E34F26"}} stroke={2} />,
    bgColor: "#E34F26",
  },
  {
    title: "GitHub",
    icon: <IconBrandGithub style={{color:"#FAFAFA"}} stroke={2} />,
    bgColor: "#FAFAFA",
  },
];

const Card = ({
  skills,
  icon,
  children,
  bgColor,
}: {
  skills: {
    title: string;
    icon: React.JSX.Element;
    bgColor?: string;
  }[];
  icon: React.ReactNode;
  children?: React.ReactNode;
  bgColor?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border rounded-2xl shadow-xl bg-gray-900 border-gray-800 group/canvas-card overflow-hidden flex items-center justify-center  max-w-sm w-full mx-auto p-4 relative h-[30rem]"
    >
      <Meteors number={30} className="max-w-sm group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200"/>
      {/* <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white " />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " /> */}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        {/* <IconBrandGithub stroke={2} /> */}
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-4 place-items-center opacity-0 group-hover/canvas-card:opacity-100 relative z-10 group-hover/canvas-card:-translate-y-2 transition duration-200">
            {skills.map((skill) => (
              <SkillCard
                title={skill.title}
                icon={skill.icon}
                bgColor={skill.bgColor}
                key={skill.title}
              />
            ))}
          </div>
          <div className=" absolute text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center inset-0"
          style={{color: bgColor,fontSize:20, fontFamily: "montserrat",}}>
            {icon}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export const SkillCard = ({
  title,
  icon,
  bgColor,
}: {
  title: string;
  icon: React.JSX.Element;
  bgColor?: string;
}) => {
  return (
    <div className="h-[5rem] w-[5rem] border rounded-3xl shadow-md flex flex-col justify-center items-center p-2"
    style={{ backgroundColor: "",
      borderColor: bgColor, 
      opacity: 0.7,
      backdropFilter: "blur(20px)",
      backgroundClip: "padding-box",
    }}>
      {icon}
      <h3 className="text-sm font-semibold text-center"
      style={{color: bgColor}}>{title}</h3>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
