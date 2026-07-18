"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { 
  IconBrain, 
  IconSchool, 
  IconUsers, 
  IconCode,
  IconBuilding,
  IconCalendar,
  IconMapPin,
  IconTrophy
} from "@tabler/icons-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  type: "Research" | "Teaching" | "Industry" | "Leadership";
  description: string;
  achievements: string[];
  technologies?: string[];
  metrics?: string[];
  logo: string;
  icon: React.ReactNode;
  color: string;
  current: boolean;
}

const experiences: Experience[] = [
  {
    id: "ifs-copperleaf-ai",
    title: "AI Engineering Co-op",
    company: "IFS Copperleaf",
    location: "Vancouver, BC",
    duration: "Oct 2025 - Present",
    type: "Industry",
    description: "Collaborating with the Technology & AI team to identify and automate repetitive tasks using scripting and workflow automation, enhancing operational efficiency. Assisting in exploring and implementing AI-assisted tools to streamline IT processes.",
    achievements: [
      "Collaborate with the Technology & AI team to identify and automate repetitive tasks using scripting and workflow automation, enhancing operational efficiency",
      "Assist in exploring and implementing AI-assisted tools to streamline IT processes like ticket handling and user self-service",
      "Contribute to organization-wide rollout of LLM solutions by developing adoption strategies & establishing best practices"
    ],
    technologies: ["Python", "Scripting", "Workflow Automation", "AI Tools", "LLM Solutions", "IT Process Optimization"],
    metrics: ["Process Automation", "AI Implementation", "LLM Rollout"],
    logo: "/copperleaf-logo.png",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-emerald-500 to-green-500",
    current: true
  },
  {
    id: "socius-research",
    title: "Undergraduate Research Assistant (HCI/AI) Co-op (May 2025 - Aug 2025)",
    company: "SOCIUS Lab, UBC",
    location: "Vancouver, BC",
    duration: "Feb 2025 - Present",
    type: "Research",
    description: "Leading end-to-end development of production-ready AI systems for policy aggregation and accessibility analysis. Managing project timelines directly with lead professor and presenting weekly demos to stakeholders.",
    achievements: [
      "Led development of two full-stack AI applications translating research goals into production systems",
      "Delivered production-ready AI Policy Aggregator deployed on AWS, actively used by research stakeholders",
      "Drove project progress with weekly demos and iterative development cycles",
      "Communicated technical findings through presentations, reports, and data visualizations"
    ],
    technologies: ["Python", "React 19", "FastAPI", "OpenAI GPT-4", "ChromaDB", "AWS", "Docker"],
    metrics: ["2 Production Apps", "Weekly Demos", "AWS Deployment"],
    logo: "/UBC_logo.png",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    current: true
  },
  {
    id: "ubc-ta",
    title: "Undergraduate Teaching Assistant",
    company: "Computer Science Dept., UBC",
    location: "Vancouver, BC", 
    duration: "Sep 2024 - Jun 2025",
    type: "Teaching",
    description: "Teaching weekly tutorials for 35+ students in upper-year Computer Networking (CPSC 317), focusing on TCP/IP, DNS, and routing protocols. Supporting lectures with 250+ students across multiple terms.",
    achievements: [
      "Redesigned tutorial format with visually engaging slides, leading to 20% increase in attendance",
      "Format adopted across all sections due to effectiveness and student engagement",
      "Supported 250+ students over 2 Winter Terms and 1 Summer Term",
      "Created supplementary materials to enhance learning outcomes for complex networking concepts"
    ],
    technologies: ["Computer Networking", "TCP/IP", "DNS", "Routing Protocols", "Educational Technology"],
    metrics: ["35+ Students/Tutorial", "20% Attendance Increase", "250+ Students Supported"],
    logo: "/UBC_CS_logo.png",
    icon: <IconSchool className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
    current: false
  },
  {
    id: "dyne-tech",
    title: "Tech Associate",
    company: "Dyne",
    location: "Vancouver, BC",
    duration: "Oct 2022 - Mar 2023",
    type: "Industry",
    description: "Collaborated on design and testing of front-end functionalities within the Dyne mobile application, ensuring seamless performance and user satisfaction using Flutter and automated testing tools.",
    achievements: [
      "Collaborated on design and meticulous testing of front-end functionalities",
      "Utilized Flutter and Katalon Studios to automate testing processes",
      "Played pivotal role in app refinement through active bug detection and resolution",
      "Demonstrated expertise in Flutter to identify and rectify potential issues"
    ],
    technologies: ["Flutter", "Katalon Studios", "Mobile Development", "Quality Assurance", "Bug Testing"],
    metrics: ["Mobile App Testing", "Automated QA", "Production App"],
    logo: "/dyne logo.png",
    icon: <IconCode className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    current: false
  },
  // {
  //   id: "a2d-flutter",
  //   title: "Flutter Developer Intern",
  //   company: "A2D Innovations Pvt Ltd",
  //   location: "Lucknow, UP, India (Remote)",
  //   duration: "Feb 2021 - May 2021",
  //   type: "Industry",
  //   description: "Dove deep into programming by implementing various modules and libraries while working closely with peers on GitHub. Refined dataset management techniques and linked backend data to frontend interfaces.",
  //   achievements: [
  //     "Implemented various modules and libraries, improving programming skills significantly",
  //     "Worked closely with peers on GitHub, learning collaboration and meeting tight deadlines",
  //     "Refined dataset management techniques for efficient data handling",
  //     "Seamlessly linked backend data to frontend interfaces using personalized APIs and data models"
  //   ],
  //   technologies: ["Flutter", "GitHub", "API Development", "Data Models", "Backend Integration"],
  //   metrics: ["Remote Collaboration", "API Integration", "Data Management"],
  //   logo: "/a2d logo.jpg",
  //   icon: <IconBuilding className="w-6 h-6" />,
  //   color: "from-orange-500 to-red-500",
  //   current: false
  // }
];

function Experiences() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <IconUsers className="w-6 h-6 sm:w-8 sm:h-8 text-ai-cyan" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Professional <span className="text-gradient">Experience</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            From cutting-edge AI research at UBC to teaching the next generation of developers,
            building real-world applications that make a difference.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative space-y-8">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ai-cyan via-ai-purple to-ai-pink" 
               style={{ transform: 'translateX(-50%)' }} 
          />
          
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-6 md:left-1/2 top-8 w-4 h-4 rounded-full ${exp.current ? 'bg-green-500 animate-pulse' : 'bg-ai-cyan'} border-4 border-neutral-900 z-10`}
                   style={{ transform: 'translateX(-50%)' }}
              />
              
              <div className={`group glass-card p-4 sm:p-6 md:p-8 rounded-2xl hover:scale-[1.02] transition-all-smooth hover:shadow-2xl relative overflow-hidden ${
                index % 2 === 0 ? 'md:mr-[52%]' : 'md:ml-[52%]'
              } ml-16 md:ml-0`}
              >
              {/* Gradient Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              
              <div className="grid md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {/* Company Logo & Type */}
                <div className="flex flex-col items-center space-y-2 md:space-y-3">
                  <motion.div 
                    className="relative w-48 h-48 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-72 lg:h-72 flex-shrink-0 group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Glowing effect on hover */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300`} />
                    <div className="relative w-full h-full bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        fill
                        sizes="(min-width:1024px) 288px, (min-width:768px) 240px, (min-width:640px) 208px, 192px"
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </motion.div>
                  <div className="flex flex-col items-center space-y-1 text-center">
                    <motion.span 
                      className={`px-4 py-2 text-sm font-medium rounded-full border ${
                        exp.type === 'Research' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                        exp.type === 'Teaching' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                        exp.type === 'Industry' ? 'bg-purple-500/20 text-purple-400 border-purple-400/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {exp.icon}
                      <span className="ml-2">{exp.type}</span>
                    </motion.span>
                    {exp.current && (
                      <motion.div 
                        className="text-sm text-green-400 font-medium flex items-center space-x-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span>Current</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Experience Details */}
                <div className="md:col-span-3">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2 group-hover:from-ai-cyan group-hover:to-ai-purple transition-all duration-300">
                      {exp.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                      <motion.span 
                        className="flex items-center space-x-1 hover:text-ai-cyan transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <IconBuilding className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-ai-cyan font-medium">{exp.company}</span>
                      </motion.span>
                      <motion.span 
                        className="flex items-center space-x-1 hover:text-white transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <IconMapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{exp.location}</span>
                      </motion.span>
                      <motion.span 
                        className="flex items-center space-x-1 hover:text-white transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <IconCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{exp.duration}</span>
                      </motion.span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4 group-hover:text-gray-200 transition-colors">
                      {exp.description}
                    </p>
                  </div>

                  {/* Key Achievements */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center space-x-2">
                      <IconTrophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                      <span className="text-sm sm:text-base">Key Achievements</span>
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <motion.li 
                          key={idx} 
                          className="text-gray-300 text-xs sm:text-sm flex items-start group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <span className="text-ai-cyan mr-2 mt-1 group-hover:scale-125 transition-transform">✦</span>
                          <span className="leading-relaxed group-hover:text-white transition-colors">{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies & Metrics */}
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {exp.technologies && (
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold mb-2 text-xs sm:text-sm flex items-center space-x-2">
                          <IconCode className="w-3 h-3 text-ai-purple" />
                          <span>Technologies</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.slice(0, 5).map((tech, idx) => (
                            <motion.span 
                              key={tech} 
                              className="px-2.5 py-1 text-xs glass rounded-lg text-gray-300 border border-white/10 hover:border-ai-purple/50 hover:bg-ai-purple/10 transition-all cursor-default"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.05, y: -2 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                          {exp.technologies.length > 5 && (
                            <span className="px-2.5 py-1 text-xs text-gray-400 flex items-center">
                              +{exp.technologies.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {exp.metrics && (
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold mb-2 text-xs sm:text-sm flex items-center space-x-2">
                          <IconTrophy className="w-3 h-3 text-yellow-400" />
                          <span>Impact Metrics</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.metrics.map((metric, idx) => (
                            <motion.span 
                              key={metric} 
                              className={`px-2.5 py-1 text-xs rounded-lg bg-gradient-to-r ${exp.color} text-white font-medium border border-white/20 hover:scale-105 transition-transform cursor-default`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              viewport={{ once: true }}
                            >
                              {metric}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-ai-blue/5 via-ai-purple/5 to-ai-pink/5 animate-pulse" />
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Experience <span className="text-gradient">Highlights</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <motion.div 
                  className="text-center p-4 rounded-xl glass hover:scale-105 transition-transform group cursor-default"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconBrain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-ai-blue mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base sm:text-lg md:text-xl font-bold text-white">Research</div>
                  <div className="text-xs sm:text-sm text-gray-400">AI/HCI Systems</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl glass hover:scale-105 transition-transform group cursor-default"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconSchool className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-ai-green mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base sm:text-lg md:text-xl font-bold text-white">Teaching</div>
                  <div className="text-xs sm:text-sm text-gray-400">250+ Students</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl glass hover:scale-105 transition-transform group cursor-default"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconCode className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-ai-purple mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base sm:text-lg md:text-xl font-bold text-white">Development</div>
                  <div className="text-xs sm:text-sm text-gray-400">Production Apps</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl glass hover:scale-105 transition-transform group cursor-default"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconUsers className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-ai-cyan mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-base sm:text-lg md:text-xl font-bold text-white">Collaboration</div>
                  <div className="text-xs sm:text-sm text-gray-400">Cross-functional Teams</div>
                </motion.div>
              </div>
            </div>
        </div>
        </motion.div>
    </div>
    </section>
  );
}

export default Experiences;
