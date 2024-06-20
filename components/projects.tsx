"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

const Projects = () => {
  return <HeroParallax products={products} />;
};
export const products = [
  {
    title: "JobGeek",
    description:
      "A job search platform where you can track job listings accross different platforms",
    link: "https://jobgeek.vercel.app/",
    github: "",
    thumbnail: "/JobGeek.png",
  },
  {
    title: "Covninet",
    description:
      "Changing the way we handle covid. When you don’t know where to test, or who to talk to when you’re dealing with covid, CoviNet has you covered.",
    link: "https://devpost.com/software/covinet",
    github: "https://github.com/Arjun-Mishra-312/covinet",
    thumbnail: "/covinet.png",
  },

  {
    title: "AugMy",
    description:
      "An app that helps you visualize 2D pictures from your book in 3D, and provide youtube videos related to that topic ",
    link: "https://devpost.com/software/augmy",
    github: "https://github.com/Arjun-Mishra-312/augmy",
    thumbnail: "/augmy.png",
  },

  {
    title: "Ace",
    description:
      "A super banking mobile application that enables users to save and track their income, expenses across all their bank accounts and wallets and learn something new about finance every day.",
    link: "https://devpost.com/software/ace-q0ck2z",
    github: "https://github.com/Arjun-Mishra-312/ace",
    thumbnail: "/ace.png",
  },
  {
    title: "Question Me",
    description: "An app that helps you prepare for your dream interview.",
    link: "https://devpost.com/software/question-me",
    github: "https://github.com/Arjun-Mishra-312/question_me",
    thumbnail: "/question me.png",
  },
  {
    title: "Together",
    description:
      "Connect securely to volunteer, donate, and enhance mental wellness, while receiving exclusive NFTs as appreciation for your contributions.",
    link: "https://devpost.com/software/together-n8qrwb",
    github: "https://github.com/Arjun-Mishra-312/together",
    thumbnail: "/together.png",
  },
];
export default Projects;
