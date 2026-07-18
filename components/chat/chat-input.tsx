"use client";
import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { IconSend, IconLoader2 } from '@tabler/icons-react';
import { useChatContext } from '@/lib/chat-context';
import { useTheme } from '@/lib/theme-context';

interface ChatInputProps {
  onSendMessage?: (message: string) => Promise<void>;
  onInputChange?: (value: string) => void;
}

export function ChatInput({ onSendMessage, onInputChange }: ChatInputProps) {
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { addMessage } = useChatContext();

  const handleInputChange = (value: string) => {
    setInput(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput('');
    setIsSending(true);

    // Add user message
    addMessage({
      type: 'user',
      content: message,
    });

    try {
      if (onSendMessage) {
        await onSendMessage(message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card transition-colors duration-300" style={{ 
      borderTop: `1px solid var(--border-color)`,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              rows={1}
              disabled={isSending}
              className="w-full px-4 py-3 pr-12 rounded-2xl glass-card focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
                border: `1px solid var(--border-color)`,
                color: 'var(--text-primary)',
                background: 'var(--glass-bg)'
              }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-ai-blue/25"
          >
            {isSending ? (
              <IconLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <IconSend className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        
        <p className="text-xs mt-2 text-center transition-colors duration-300" style={{ color: 'var(--text-tertiary)' }}>
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
