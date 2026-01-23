"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MicroWidget, WidgetPlacement } from '@/types/micro-widgets';

export type MessageType = 'user' | 'assistant' | 'widget' | 'system';
export type WidgetType = 'me' | 'projects' | 'skills' | 'experience' | 'awards' | 'fun' | 'contact';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  widgetType?: WidgetType;
  microWidgets?: MicroWidget[];
  widgetPlacement?: WidgetPlacement;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addWidgetMessage: (widgetType: WidgetType, content: string) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addWidgetMessage = useCallback((widgetType: WidgetType, content: string) => {
    addMessage({
      type: 'widget',
      content,
      widgetType,
    });
  }, [addMessage]);

  const setTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        addMessage,
        addWidgetMessage,
        setTyping,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
