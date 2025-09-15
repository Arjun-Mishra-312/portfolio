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
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconUsers className="w-8 h-8 text-ai-cyan" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Professional <span className="text-gradient">Experience</span>
          </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From cutting-edge AI research at UBC to teaching the next generation of developers, 
            building real-world applications that make a difference.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl hover:scale-[1.02] transition-all-smooth"
            >
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Company Logo & Type (icons removed) */}
                <div className="flex lg:flex-col items-start lg:items-center space-x-4 lg:space-x-0 lg:space-y-4">
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 lg:w-64 lg:h-64">
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      fill
                      // sizes="(min-width:1024px) 256px, (min-width:640px) 224px, 192px"
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div className="lg:text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      exp.type === 'Research' ? 'bg-blue-500/20 text-blue-400' :
                      exp.type === 'Teaching' ? 'bg-green-500/20 text-green-400' :
                      exp.type === 'Industry' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {exp.type}
                    </span>
                    {exp.current && (
                      <div className="text-xs text-green-400 mt-1 font-medium">Current</div>
                    )}
                  </div>
                </div>

                {/* Experience Details */}
                <div className="lg:col-span-3">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <IconBuilding className="w-4 h-4" />
                        <span className="text-ai-cyan font-medium">{exp.company}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IconMapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IconCalendar className="w-4 h-4" />
                        <span>{exp.duration}</span>
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">{exp.description}</p>
                  </div>

                  {/* Key Achievements */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <IconTrophy className="w-4 h-4 text-ai-cyan" />
                      <span>Key Achievements</span>
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start">
                          <span className="text-ai-cyan mr-2 mt-1">▪</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies & Metrics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {exp.technologies && (
                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Technologies</h4>
                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.slice(0, 5).map((tech) => (
                            <span key={tech} className="px-2 py-1 text-xs glass rounded text-gray-300">
                              {tech}
                            </span>
                          ))}
                          {exp.technologies.length > 5 && (
                            <span className="px-2 py-1 text-xs text-gray-400">
                              +{exp.technologies.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {exp.metrics && (
                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Impact Metrics</h4>
                        <div className="flex flex-wrap gap-1">
                          {exp.metrics.map((metric) => (
                            <span key={metric} className="px-2 py-1 text-xs bg-ai-blue/20 text-ai-blue rounded">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
          className="mt-16"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Experience Highlights
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <IconBrain className="w-8 h-8 text-ai-blue mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Research</div>
                <div className="text-sm text-gray-400">AI/HCI Systems</div>
              </div>
              <div className="text-center">
                <IconSchool className="w-8 h-8 text-ai-green mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Teaching</div>
                <div className="text-sm text-gray-400">250+ Students</div>
              </div>
              <div className="text-center">
                <IconCode className="w-8 h-8 text-ai-purple mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Development</div>
                <div className="text-sm text-gray-400">Production Apps</div>
              </div>
              <div className="text-center">
                <IconUsers className="w-8 h-8 text-ai-cyan mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Collaboration</div>
                <div className="text-sm text-gray-400">Cross-functional Teams</div>
              </div>
            </div>
        </div>
        </motion.div>
    </div>
    </section>
  );
}

export default Experiences;
