"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Message } from '@/lib/chat-context';
import { useTheme } from '@/lib/theme-context';
import { IconUser } from '@tabler/icons-react';
import { MicroWidgetRenderer } from './micro-widgets/micro-widget-renderer';
import { AnimatedGreeting } from './intro-components/animated-greeting';
import { PreviewCards } from './intro-components/preview-cards';
import { IntroProfileCard } from './intro-components/intro-profile-card';

interface MessageBubbleProps {
  message: Message;
  children?: React.ReactNode;
  onPreviewCardClick?: (type: any) => void;
}

export function MessageBubble({ message, children, onPreviewCardClick }: MessageBubbleProps) {
  const { theme } = useTheme();
  const isUser = message.type === 'user';
  const isWidget = message.type === 'widget';
  const hasMicroWidgets = message.microWidgets && message.microWidgets.length > 0;

  // Check if this is the special greeting message
  const isGreeting = message.content === 'greeting';
  
  // Check if this is the profile card message
  const isProfileCard = message.content === 'profileCard';

  // Check if this has preview cards
  const hasPreviewCards = hasMicroWidgets && message.microWidgets?.some(w => (w.type as any) === 'previewCards');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <IconUser className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden glass-card">
            <Image
              src="/pfp.png"
              alt="Arjun"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
        {isWidget ? (
          // Full widget message
          <div className="w-full">
            {children}
          </div>
        ) : (
          <>
            {/* Micro widgets before text */}
            {hasMicroWidgets && message.widgetPlacement === 'before' && (
              <div className="w-full space-y-3">
                {message.microWidgets?.filter(w => (w.type as any) !== 'previewCards').map((widget, index) => (
                  <MicroWidgetRenderer key={index} widget={widget} />
                ))}
              </div>
            )}

            {/* Text message */}
            {!isGreeting && !isProfileCard && (
              <div
                className={`px-4 py-3 rounded-2xl transition-colors duration-300 ${
                  isUser
                    ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white rounded-tr-sm'
                    : 'glass-card rounded-tl-sm'
                }`}
                style={!isUser ? { color: 'var(--text-primary)' } : undefined}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            )}

            {/* Animated greeting */}
            {isGreeting && (
              <div className="px-4 py-3 rounded-2xl glass-card rounded-tl-sm">
                <AnimatedGreeting />
              </div>
            )}

            {/* Animated profile card */}
            {isProfileCard && (
              <div className="w-full flex justify-start">
                <IntroProfileCard />
              </div>
            )}

            {/* Micro widgets after text */}
            {hasMicroWidgets && (message.widgetPlacement === 'after' || !message.widgetPlacement) && (
              <div className="w-full space-y-3">
                {hasPreviewCards && onPreviewCardClick ? (
                  <PreviewCards onCardClick={onPreviewCardClick} />
                ) : (
                  message.microWidgets?.filter(w => (w.type as any) !== 'previewCards').map((widget, index) => (
                    <MicroWidgetRenderer key={index} widget={widget} />
                  ))
                )}
              </div>
            )}
          </>
        )}
        
        {/* Timestamp */}
        {!isGreeting && !isProfileCard && (
          <span className="text-xs mt-1 px-2 transition-colors duration-300" style={{ color: 'var(--text-tertiary)' }}>
            {message.timestamp.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
