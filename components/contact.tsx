"use client";
import Link from "next/link";
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
                <button className=" bg-white w-40 h-10 rounded-xl text-black">
                  Resume
                </button>
              </Link>
              <Link href="/transcript.pdf">
                <button className="bg-white w-40 h-10 rounded-xl text-black">
                  Transcript
                </button>
              </Link>
            </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 pt-4">
        <Link href="https://www.linkedin.com/in/-arjun-mishra/">
          <button className="w-40 h-10 rounded-xl bg-black border border-blue-400 text-blue-400 text-sm">
            Connect on LinkedIn
          </button>
        </Link>
        <Link href="mailto:arjun.mishra.work@gmail.com">
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            Contact on Email
          </button>
        </Link>
      </div>
      
    </div>
  );
}
