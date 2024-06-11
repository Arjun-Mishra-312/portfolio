import Hero from "@/components/Hero";
import Checking from "@/components/checking";
import Image from "next/image";


export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center 
    items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-2-7xl w-full">
        <Hero />
        <Checking/>
      </div>
    </main>
    // <Hero />
  );
}
