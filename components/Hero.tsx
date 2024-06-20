"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "./ui/background-beams";
import Link from "next/link";
import Image from "next/image";
import { FlipWords } from "./ui/flip-words";

export function Intro() {
  const words = ["Website\u00A0Developer", "App\u00A0Developer", "Team\u00A0Player", "Passionate\u00A0Individual"];
  return (
    <div className="h-screen pb-20 pt-36">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex lg:flex-row flex-col gap-4 items-center justify-center px-4"
      >
        {/* <div className="relative flex sm:flex-col md:flex-col lg:flex-row items-center justify-evenly w-screen"> */}
          <div>
            <div className="text-3xl md:text-7xl font-bold dark:text-white text-start">
              Arjun Mishra
            </div>
            <div className="font-extralight text-base md:text-3xl dark:text-neutral-200 py-4">
              Hi there! I am a 
              <FlipWords words={words} /> <br />
              I build captivating digital experiences as a developer and designer.
              <br />
              Welcome to my portfolio!
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 pt-2">
              <Link href="/Resume.pdf">
                <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                  Resume
                </button>
              </Link>
              <Link href="https://devpost.com/software/covinet" passHref legacyBehavior>
                <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                  Transcript
                </button>
              </Link>
            </div>
          </div>
            <div className="relative w-60 h-60 sm:mt-10">
              <Image
                src="/pfp.png" // Replace with the path to your photo
                alt="Your Name"
                layout="fill"
                className="object-cover"
                style={{borderRadius: "50px" }}
              />
            </div>
          {/* </div> */}
      </motion.div>
      

      <BackgroundBeams className="h-screen" />
    </div>
  );
};


