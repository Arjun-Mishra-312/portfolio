"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
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
      className: "text-blue-500 dark:text-cyan-400",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        Thank you for visiting my portfolio
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-blue-400 border-transparent dark:text-blue-400 text-sm">
          Connect on LinkedIn
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Contact on Email
        </button>
      </div>
    </div>
  );
}
