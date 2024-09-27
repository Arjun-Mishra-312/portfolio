"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-black-100 font-sans md:px-10"
      ref={containerRef}
    >
      {/* <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Changelog from my journey
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-s md:text-base max-w-sm">
          I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
          a timeline of my journey.
        </p>
      </div> */}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export function TimelineDemo() {
  const data = [
    {
      title: "Sept 2024 - Present",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-100 text-l md:text-sm font-bold mb-8">
            Undergraduate Teaching Assistant | UBC | Vancouver, BC
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-s md:text-sm font-normal mb-8">
            <ul className="list-disc list-inside">
              <li>
                Teaching Assistant for upper-year level Computer Networking
                course (CPSC 317), focusing on network protocols, architecture,
                and applications.
              </li>
              <li>
                Leading weekly tutorials for 35+ students and supported lectures
                with 140+ attendance, guiding practical exercises, and
                explaining complex networking concepts
              </li>
            </ul>
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/UBC_CS_logo.jpg"
              width={300}
              height={300}
              //   style={{objectFit:"contain"}}
              alt="linear demo image"
              className="rounded-lg object-contain h-30 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Oct 2022 - Mar 2023",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-100 text-l md:text-sm font-bold mb-8">
            Tech Associate | Dyne | Vancouver, BC
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-s md:text-sm font-normal mb-8">
            <ul className="list-disc list-inside">
              <li>
                Automated 40% of testing processes using Flutter and Katalon
                Studios, reducing manual testing time by 60% and improving
                overall app reliability.
              </li>
              <li>
                Identified and resolved 20+ critical bugs, leading to a 20%
                decrease in app crashes and a 25% improvement in app
                performance.
              </li>
            </ul>
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/dyne logo.png"
              width={500}
              height={500}
              alt="linear demo image"
              className="rounded-lg object-contain h-30 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Feb 2021 - May 2021",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-100 text-l md:text-sm font-bold mb-8">
            Flutter Developer Intern| A2D Innovations Pvt Ltd| Lucknow, UP,
            India (Remote)
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-s md:text-sm font-normal mb-8">
            <ul className="list-disc list-inside">
              <li>
                Implemented 10+ new modules and libraries, contributing to a 40%
                increase in app functionality.
              </li>
              <li>
                Collaborated with a team of 4 developers on GitHub, improving
                code quality and reducing merge conflicts by 30%.
              </li>
              <li>
                Implemented custom APIs and data models in Flutter, improving
                backend-to-frontend data flow efficiency by 40%.
              </li>
            </ul>
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/a2d logo.jpg"
              width={500}
              height={500}
              alt="linear demo image"
              className="rounded-lg object-contain h-30 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
