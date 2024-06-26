"use client";
import Link from "next/link";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { IconBrandGithub, IconBrandLinkedin, IconFile, IconMail } from "@tabler/icons-react";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Contact",
    },
    {
      text: "me",
    },
    {
      text: "for",
    },
    {
      text: "inquiries",
    },
    {
      text: ", connection",
    },
    {
      text: ", or",
    },
    {
      text: "collaborations.",
      className: "text-cyan-400",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className=" text-neutral-200 text-xs sm:text-base  ">
        Thank you for visiting my portfolio
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 px-4">
        <Link href="/Resume.pdf">
          <button className="relative w-40  inline-flex h-12 overflow-hidden rounded-full p-[1px] bg-purple-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-purple-400">
            {/* <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CE93D8_0%,#9C27B0_50%,#CE93D8_100%)]" /> */}
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black-100 px-3 py-1 text-sm font-medium text-purple-400 backdrop-blur-3xl">
            <IconFile color="#CE93D8" stroke={1.5} className="mr-1" />
              Resume
            </div>
          </button>
        </Link>
        <Link href="https://github.com/Arjun-Mishra-312">
          <button className="relative w-40  inline-flex h-12 overflow-hidden rounded-full p-[1px] bg-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-gray-300">
            {/* <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E0E0E0_0%,#9E9E9E_50%,#EEEEEE_100%)]" /> */}
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black-100 px-3 py-1 text-sm font-medium text-gray-300 backdrop-blur-3xl">
              <IconBrandGithub color="#E0E0E0" stroke={1.5} className="mr-1" />
              GitHub
            </div>
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 pt-4">
        <Link href="https://www.linkedin.com/in/-arjun-mishra/">
          {/* <button className="w-40 h-10 rounded-xl bg-black border border-blue-400 text-blue-400 text-sm">
            Connect on LinkedIn
          </button> */}
          <button className="relative w-40 inline-flex h-12 overflow-hidden rounded-full p-[1px] bg-blue-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-blue-400">
            {/* <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#BBDEFB_0%,#42A5F5_50%,#BBDEFB_100%)]" /> */}
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black-100 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-3xl">
            <IconBrandLinkedin color="#42A5F5" stroke={1.5} className="mr-1" />
              LinkedIn
            </div>
          </button>
        </Link>
        <Link href="mailto:arjun.mishra.work@gmail.com">
        <button className="relative w-40 inline-flex h-12 overflow-hidden rounded-full p-[1px] bg-teal-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-teal-500">
            {/* <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#80CBC4_0%,#009688_50%,#80CBC4_100%)]" /> */}
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black-100 px-3 py-1 text-sm font-medium text-teal-500 backdrop-blur-3xl">
            <IconMail color="#009688" stroke={1.5} className="mr-2" />
              Email
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}
