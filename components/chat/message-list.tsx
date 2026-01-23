"use client";
import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatContext, WidgetType } from '@/lib/chat-context';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { WidgetRenderer } from './widget-renderer';

interface MessageListProps {
  onNavigate?: (widgetType: WidgetType) => void;
}

export function MessageList({ onNavigate }: MessageListProps) {
  const { messages, isTyping } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              onPreviewCardClick={onNavigate}
            >
              {message.type === 'widget' && message.widgetType && (
                <WidgetRenderer widgetType={message.widgetType} />
              )}
            </MessageBubble>
          ))}
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
