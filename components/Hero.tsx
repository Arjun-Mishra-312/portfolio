"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "./ui/background-beams";
import Link from "next/link";
import Image from "next/image";



const Hero = () => {
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
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="flex items-center justify-center mt-8">
      <div className="relative w-32 h-32">
        <Image
          src="/path/to/your/photo.jpg" // Replace with the path to your photo
          alt="Your Name"
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
    </div>
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Arjun Mishra
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="https://www.linkedin.com/in/-arjun-mishra/">
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Resume
        </button>
        </Link>
        <Link href={""}>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Transcript
        </button>
        </Link>
      </div>
        
      </motion.div>
      
        <BackgroundBeams className="h-screen"/>
    </div>
  );
};

export default Hero;
