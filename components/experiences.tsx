"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function Experiences() {
  return (
    <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Tech Associate| Dyne| Vancouver, BC
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            • Collaborated on the design and meticulous testing of front-end
            functionalities within the Dyne mobile application, ensuring
            seamless performance and user satisfaction. Utilized Flutter and
            Katalon Studios to automate testing processes, contributing to
            high-quality and reliable results. (Flutter, Katalon Studios)
            <br /> 
            <br />
            •Played a pivotal role in app refinement by actively engaging in bug
            detection and resolution. Demonstrated expertise in Flutter to
            identify and rectify potential issues, ensuring optimal app
            functionality.
          </p>
        </div>
        {/* <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        /> */}
        <p className="mt-4 absolute -right-0 -top-0 text-right text-base/6 text-neutral-200">
        2024
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 row-span-2 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Software Developer Intern| MorningStar Technologies| Lucknow, UP, India
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
        • Successfully built an app from scratch using a Microsoft SQL server and SQLite local database, showcasing
        proficiency in Flutter and MySQL.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-blue-900 min-h-[400px] lg:min-h-[400px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Flutter Developer Intern| A2D Innovations Pvt Ltd| Lucknow, UP, India (Remote)
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          • Managed to dive deep into programming by implementing various modules and libraries, improving my skills along
the way. Worked closely with peers on GitHub, learning the ropes of collaboration, and developed a knack for
meeting tight deadlines. Additionally, I took the initiative to refine dataset management techniques and seamlessly
linked backend data to frontend interfaces using personalized APIs and data models in Flutter.
          </p>
        </div>
        <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
