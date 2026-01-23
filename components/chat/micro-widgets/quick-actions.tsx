"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  IconDownload,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from '@tabler/icons-react';

interface Action {
  label: string;
  icon: React.ReactNode;
  href: string;
  primary?: boolean;
  external?: boolean;
}

const actions: Action[] = [
  {
    label: 'Resume',
    icon: <IconDownload className="w-4 h-4" />,
    href: '/Resume.pdf',
    primary: true,
    external: true,
  },
  {
    label: 'Email',
    icon: <IconMail className="w-4 h-4" />,
    href: 'mailto:arjunmishra31204@gmail.com',
  },
  {
    label: 'LinkedIn',
    icon: <IconBrandLinkedin className="w-4 h-4" />,
    href: 'https://linkedin.com/in/-arjun-mishra/',
    external: true,
  },
  {
    label: 'GitHub',
    icon: <IconBrandGithub className="w-4 h-4" />,
    href: 'https://github.com/Arjun-Mishra-312',
    external: true,
  },
];

interface QuickActionsProps {
  primary?: string;
}

export function QuickActions({ primary = 'resume' }: QuickActionsProps) {
  const { theme } = useTheme();

  // Reorder to show primary first
  const orderedActions = [
    ...actions.filter(a => a.label.toLowerCase() === primary),
    ...actions.filter(a => a.label.toLowerCase() !== primary),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {orderedActions.map((action, index) => (
          <motion.a
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.08,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              text-sm font-medium transition-all
              ${action.primary || index === 0
                ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white shadow-lg hover:shadow-xl hover:shadow-ai-blue/25'
                : theme === 'light'
                  ? 'glass-card text-gray-900 border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  : 'glass-card text-white border border-white/10 hover:border-ai-cyan/50'
              }
            `}
          >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
