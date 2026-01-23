"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { IconBrandLinkedin, IconBrandGithub } from "@tabler/icons-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: ReactNode;
}

interface AnimatedProfileCardProps {
  name?: string;
  role?: string;
  about?: string;
  imageUrl?: string;
  socialLinks?: SocialLink[];
}

export function AnimatedProfileCard({
  name = "Arjun Mishra",
  role = "AI Research Assistant @ UBC",
  about = "Building intelligent systems that solve real-world problems",
  imageUrl = "/pfp.png",
  socialLinks = [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/-arjun-mishra/",
      icon: <IconBrandLinkedin className="w-5 h-5" />,
    },
    {
      platform: "GitHub",
      url: "https://github.com/Arjun-Mishra-312",
      icon: <IconBrandGithub className="w-5 h-5" />,
    },
  ],
}: AnimatedProfileCardProps) {
  return (
    <div className="animated-profile-card">
      {/* Profile Picture */}
      <div className="profile-pic">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Bottom Section */}
      <div className="profile-bottom">
        <div className="profile-content">
          <span className="profile-name">{name}</span>
          <span className="profile-role">{role}</span>
          <span className="profile-about">{about}</span>
        </div>

        <div className="profile-footer">
          {/* Social Links */}
          <div className="social-links-container">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={link.platform}
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Contact Button */}
          <a
            href="mailto:arjunmishra31204@gmail.com"
            className="profile-button"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
