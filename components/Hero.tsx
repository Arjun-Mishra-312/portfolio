"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FlipWords } from "./ui/flip-words";

export function Intro() {
  const words = [
    "Website\u00A0Developer",
    "App\u00A0Developer",
    "Team\u00A0Player",
    "Passionate\u00A0Individual",
  ];
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
          <div className="text-3xl md:text-7xl font-bold text-white text-start">
            Arjun Mishra
          </div>
          <div className="font-extralight text-base md:text-3xl text-neutral-200 py-4">
            Hi there! I am a
            <FlipWords words={words} /> <br />
            <br />
            I am a junior Computer Science major at UBC,
            <br />
            passionate about building captivating digital experiences
            <br />
            as a developer.
            {/* <br /> */}
            <br />
            Welcome to my portfolio!!
          </div>
        </div>
        <div className="relative w-60 h-60 sm:mt-10">
          <Image
            src="/pfp.png" // Replace with the path to your photo
            alt="Your Name"
            layout="fill"
            sizes="100%"
            className="object-cover"
            style={{ borderRadius: "50px" }}
          />
        </div>
        {/* </div> */}
      </motion.div>
    </div>
  );
}
