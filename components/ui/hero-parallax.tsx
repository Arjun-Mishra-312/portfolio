"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { IconBrandGithub } from "@tabler/icons-react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    description: string;
    link: string;
    github: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 3);
  const secondRow = products.slice(3, 6);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [-250, 0]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [500, -500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [-700, 300]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="pb-0 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          translateX,
          opacity,
        }}
        className=""
      >
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center">
          {products.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </div>
        {/* <motion.div className="flex flex-row  mb-20 space-x-10 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div> */}
      </motion.div>
      <div className="h-[20rem]"></div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold  text-white">
        Personal <br /> Projects
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8  text-neutral-200">
      I create beautiful websites and apps utilizing the latest technologies and frameworks. 
      As a passionate developer and designer, I am dedicated to building exceptional 
      and innovative products.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    description: string;
    link: string;
    github: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    
      <CardContainer className="inter-var">
        <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <Link href={product.link}>
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-white"
          >
            {product.title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-sm max-w-sm mt-2 text-neutral-300"
          >
            {product.description}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={product.thumbnail}
              height={800}
              width={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          </Link>
          <div className="flex justify-between items-center mt-10">
            {product.github !="" && (
              <Link
                href={product.github}
                className="pl-2 flex flex-col items-center justify-center"
              >
                <IconBrandGithub style={{ color: "#FAFAFA" }} stroke={2} />
                <p className="text-white">Github</p>
              </Link>
            )}
          </div>
        </CardBody>
      </CardContainer>
  );
};
