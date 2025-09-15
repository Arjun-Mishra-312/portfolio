"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  IconTrophy,
  IconMedal,
  IconStar,
  IconSchool,
  IconAward,
  IconCode,
  IconBrain,
  IconUsers,
  IconCertificate
} from "@tabler/icons-react";
import { ExpandableAwardsCards } from "./ui/expandable-awards-cards";

interface Award {
  title: string;
  organization: string;
  date: string;
  description: string;
  category: "Competition" | "Academic" | "Recognition";
  icon: React.ReactNode;
  color: string;
  achievements?: string[];
  details?: string;
  impact?: string;
}

const awards: Award[] = [
  {
    title: "Winner - Hack the North 2024",
    organization: "University of Waterloo",
    date: "September 2024",
    description: "Won Canada's premier hackathon with LLM Pro Max, an innovative codebase analysis platform that revolutionizes how developers interact with large codebases using AI.",
    category: "Competition",
    icon: <IconTrophy className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-500",
    achievements: [
      "Competed against 1000+ participants from top universities",
      "Developed production-ready RAG pipeline with 86% relevancy",
      "Built interactive dependency graphs for code exploration"
    ],
    details: "Competed against 1000+ participants from top universities across North America. Built a production-ready platform using React.js, Cohere LLM, Python, and ChromaDB for RAG implementation.",
    impact: "86% relevancy in LLM-powered code analysis queries, significantly improving developer productivity for large codebases."
  },
  {
    title: "1st Place - youCode 2025, SAP Stream",
    organization: "SAP & University Partners",
    date: "February 2025",
    description: "Secured first place with Re-Plate, an intelligent food donation platform that uses AI to reduce food waste and help communities through smart redistribution.",
    category: "Competition",
    icon: <IconMedal className="w-6 h-6" />,
    color: "from-blue-500 to-purple-600",
    achievements: [
      "Achieved 100% accuracy in food expiration date detection",
      "Integrated Gemini vision + text APIs for automated food classification",
      "Built comprehensive impact analytics with CO₂ offset tracking"
    ],
    details: "Built a comprehensive platform connecting food donors with recipients using AI-powered food classification and smart redistribution algorithms.",
    impact: "Potential to reduce food waste by 30% in target communities while providing comprehensive CO₂ offset tracking and impact analytics."
  },
  {
    title: "Work Learn International Undergraduate Research Award",
    organization: "University of British Columbia",
    date: "2024-2025",
    description: "Prestigious research award supporting international students conducting high-impact undergraduate research in AI and HCI systems.",
    category: "Academic",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-green-500 to-teal-600",
    achievements: [
      "Selected for excellence in AI/HCI research proposal",
      "Funding for full-stack AI system development",
      "Direct collaboration with lead professors"
    ],
    details: "Prestigious research award supporting international students conducting high-impact undergraduate research.",
    impact: "Enabling advancement of AI-powered accessibility tools that will benefit many users with disabilities worldwide."
  },
  {
    title: "Faculty of Science International Student Scholar",
    organization: "UBC Faculty of Science",
    date: "2022-2027",
    description: "Merit-based scholarship recognizing outstanding academic achievement and potential in Computer Science among international students.",
    category: "Academic",
    icon: <IconSchool className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
    achievements: [
      "Awarded for exceptional academic performance",
      "Recognition of Extracurricular Activities",
    ],
    details: "Scholarship recognizing outstanding academic achievement and potential among international students in the Science program.",
    impact: "Maintains top percentile academic standing while actively contributing to the university community."
  },
  {
    title: "Dean's Honors List",
    organization: "UBC Faculty of Science",
    date: "Multiple Terms",
    description: "Consistent recognition for maintaining high academic standing with GPA in top percentile of Computer Science students.",
    category: "Academic",
    icon: <IconStar className="w-6 h-6" />,
    color: "from-purple-500 to-pink-600",
    achievements: [
      "Maintained top-tier academic performance",
      "Recognized across multiple academic terms",
      "Excellence in advanced CS coursework"
    ],
    details: "Placement on Dean's Honors List across multiple academic terms, recognizing sustained excellence in university coursework.",
    impact: "Demonstrates consistent academic excellence while balancing research work, hackathon participation, and project development."
  }
];

const categories = [
  { name: "Competition", icon: <IconTrophy className="w-5 h-5" />, count: 2 },
  { name: "Academic", icon: <IconSchool className="w-5 h-5" />, count: 3 },
  { name: "Recognition", icon: <IconAward className="w-5 h-5" />, count: 0 }
];

function AwardsSection() {
  return (
    <section id="awards" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute top-20 right-2 sm:right-5 lg:right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconTrophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Awards & <span className="text-gradient">Achievements</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Recognition for excellence in competitive programming, AI research,
            and academic achievement at prestigious institutions and hackathons.
          </p>
        </motion.div>

        {/* Category Overview */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {categories.map((category, index) => (
            <div key={category.name} className="glass-card p-6 rounded-xl text-center">
              <div className="flex justify-center mb-3 text-ai-cyan">
                {category.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{category.count}</div>
              <div className="text-gray-400">{category.name} Awards</div>
            </div>
          ))}
        </motion.div> */}

        {/* Expandable Awards Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ExpandableAwardsCards awards={awards as any} />
        </motion.div>
      </div>

      {/* Achievement Stats */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="glass-card p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Achievement Highlights</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">2+</div>
              <div className="text-gray-400">Hackathon Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">3+</div>
              <div className="text-gray-400">Academic Awards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">1000+</div>
              <div className="text-gray-400">Competitors Beaten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">Top %</div>
              <div className="text-gray-400">Academic Standing</div>
            </div>
          </div>
        </div>
      </motion.div> */}
    </section>
  );
}
export default AwardsSection;


// {awards.map((award, index) => (
//   <motion.div
//     key={index}
//     initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
//     whileInView={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.6, delay: index * 0.1 }}
//     viewport={{ once: true }}
//     className="glass-card p-8 rounded-2xl hover:scale-[1.02] transition-all-smooth"
//   >
//     <div className="grid lg:grid-cols-4 gap-6">
//       {/* Award Icon & Category */}
//       <div className="flex lg:flex-col items-start lg:items-center space-x-4 lg:space-x-0 lg:space-y-4">
//         <div className={`glass p-4 rounded-xl bg-gradient-to-r ${award.color}`}>
//           {award.icon}
//         </div>
//         <div className="lg:text-center">
//           <span className={`px-3 py-1 text-xs font-medium rounded-full ${award.category === 'Competition' ? 'bg-yellow-500/20 text-yellow-400' :
//               award.category === 'Academic' ? 'bg-blue-500/20 text-blue-400' :
//                 'bg-purple-500/20 text-purple-400'
//             }`}>
//             {award.category}
//           </span>
//         </div>
//       </div>

//       {/* Award Details */}
//       <div className="lg:col-span-3">
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
//             <span className="flex items-center space-x-1">
//               <IconUsers className="w-4 h-4" />
//               <span>{award.organization}</span>
//             </span>
//             <span>{award.date}</span>
//           </div>
//           <p className="text-gray-300 leading-relaxed">{award.description}</p>
//         </div>

//         {/* Achievements */}
//         {award.achievements && (
//           <div>
//             <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
//               <IconCode className="w-4 h-4 text-ai-cyan" />
//               <span>Key Achievements</span>
//             </h4>
//             <ul className="space-y-2">
//               {award.achievements.map((achievement, idx) => (
//                 <li key={idx} className="text-gray-300 text-sm flex items-start">
//                   <span className="text-ai-cyan mr-2 mt-1">▪</span>
//                   {achievement}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   </motion.div>
// ))}