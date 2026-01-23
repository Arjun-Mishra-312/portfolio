"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { ChatProvider, useChatContext, WidgetType } from '@/lib/chat-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { FloatingPills } from './suggestions/floating-pills';
import { SuggestionsFAB } from './suggestions/suggestions-fab';
import { SuggestionsDrawer } from './suggestions/suggestions-drawer';
import { ContextualSuggestions } from './suggestions/contextual-suggestions';
import { useKeyboardShortcuts } from './suggestions/keyboard-shortcuts';
import { ShortcutsHint } from './suggestions/shortcuts-hint';
import { Question, Pill, getRandomQuestion, getRandomEasterEgg } from './suggestions/questions-data';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const DarkVeil = dynamic(() => import('@/components/dark-veil'), {
  ssr: false,
});

const LightVeil = dynamic(() => import('@/components/light-veil'), {
  ssr: false,
});

function ChatContainerInner() {
  const { addMessage, addWidgetMessage, setTyping, messages } = useChatContext();
  const { theme } = useTheme();
  const [currentSection, setCurrentSection] = useState<WidgetType | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const hasInitializedRef = React.useRef(false);

  // Welcome sequence
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    
    const initializeChat = async () => {
      // Check for hash in URL
      const hash = window.location.hash.slice(1) as WidgetType;
      const validSections: WidgetType[] = ['me', 'projects', 'skills', 'experience', 'awards', 'fun', 'contact'];
      
      // First message - Animated greeting
      await new Promise(resolve => setTimeout(resolve, 500));
      setTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTyping(false);
      
      addMessage({
        type: 'assistant',
        content: "greeting", // Special marker for animated greeting
      });

      // Second message - Animated Profile Card
      await new Promise(resolve => setTimeout(resolve, 800));
      setTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTyping(false);
      
      addMessage({
        type: 'assistant',
        content: "profileCard", // Special marker for animated profile card
      });

      // Third message - About with Quick Stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setTyping(false);
      
      addMessage({
        type: 'assistant',
        content: "I'm an AI Research Assistant at UBC SOCIUS Lab, passionate about building intelligent systems and full-stack applications.",
        microWidgets: [{ type: 'quickStats' }],
        widgetPlacement: 'after',
      });

      // Fourth message - Preview cards
      await new Promise(resolve => setTimeout(resolve, 800));
      setTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTyping(false);
      
      addMessage({
        type: 'assistant',
        content: "Explore my work through these sections, or just ask me anything!",
        microWidgets: [{ type: 'previewCards' as any }], // Special type for preview cards
        widgetPlacement: 'after',
      });

      // If there's a hash, navigate to that section
      if (validSections.includes(hash)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        handleNavigate(hash);
      }
    };

    initializeChat();
  }, []);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as WidgetType;
      const validSections: WidgetType[] = ['me', 'projects', 'skills', 'experience', 'awards', 'fun', 'contact'];
      
      if (validSections.includes(hash) && hash !== currentSection) {
        handleNavigate(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSection]);

  const handleNavigate = useCallback((widgetType: WidgetType, skipHashUpdate = false) => {
    setCurrentSection(widgetType);
    
    // Only update hash if not skipped (prevents duplicate triggers from hashchange event)
    if (!skipHashUpdate) {
      window.location.hash = widgetType;
    }

    const messages: Record<WidgetType, string> = {
      me: "Here's a bit about me! 👨‍💻",
      projects: "Check out some of my projects! 🚀",
      skills: "Here are my skills and expertise! 🧠",
      experience: "My professional journey! 💼",
      awards: "Some achievements I'm proud of! 🏆",
      fun: "Let's explore some fun stuff! 🎨",
      contact: "Let's get in touch! 📧",
    };

    addWidgetMessage(widgetType, messages[widgetType]);
  }, [addWidgetMessage]);

  const handleSendMessage = async (message: string) => {
    // Clear current input for contextual suggestions
    setCurrentInput('');
    
    // Show typing indicator
    setTyping(true);
    
    try {
      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setTyping(false);
      
      // Add assistant message with text response
      addMessage({
        type: 'assistant',
        content: data.response,
        microWidgets: data.microWidgets,
        widgetPlacement: data.widgetPlacement,
      });
      
      // If a full widget is detected, add it as a separate widget message
      if (data.widgetType) {
        const validWidgetTypes: WidgetType[] = ['me', 'projects', 'skills', 'experience', 'awards', 'fun', 'contact'];
        const widgetType = validWidgetTypes.includes(data.widgetType) ? data.widgetType as WidgetType : null;
        
        if (widgetType) {
          const widgetMessages: Record<WidgetType, string> = {
            me: "Here's a bit about me! 👨‍💻",
            projects: "Check out some of my projects! 🚀",
            skills: "Here are my skills and expertise! 🧠",
            experience: "My professional journey! 💼",
            awards: "Some achievements I'm proud of! 🏆",
            fun: "Let's explore some fun stuff! 🎨",
            contact: "Let's get in touch! 📧",
          };
          
          addWidgetMessage(widgetType, widgetMessages[widgetType]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setTyping(false);
      
      // Fallback response
      addMessage({
        type: 'assistant',
        content: "I'm having trouble connecting right now. Try using the navigation buttons below to explore my portfolio, or ask me specific questions about my projects, skills, or experience!",
      });
    }
  };

  // Handle question click from suggestions
  const handleQuestionClick = useCallback((question: Question) => {
    // Add user message with the question
    addMessage({
      type: 'user',
      content: question.text,
    });

    // Send to chat API for AI response
    setTyping(true);
    handleSendMessage(question.text).finally(() => {
      setTyping(false);
    });

    // Optionally show widget if relevant (can be removed or made conditional)
    // if (question.widgetType) {
    //   handleNavigate(question.widgetType);
    // }
  }, [addMessage, handleSendMessage, setTyping]);

  // Handle special actions
  const handleSpecialAction = useCallback(async (action: string) => {
    switch (action) {
      case 'random': {
        // Random question
        const randomQ = getRandomQuestion();
        handleQuestionClick(randomQ);
        break;
      }
      case 'tour': {
        // Show all widgets in sequence
        addMessage({
          type: 'user',
          content: '🚶 Give me a quick tour',
        });
        const tourWidgets: WidgetType[] = ['me', 'projects', 'skills', 'experience', 'awards', 'fun', 'contact'];
        for (let i = 0; i < tourWidgets.length; i++) {
          await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 2000));
          handleNavigate(tourWidgets[i], true); // Skip hash update to prevent double trigger
        }
        break;
      }
      case 'everything': {
        // Show all widgets rapidly
        addMessage({
          type: 'user',
          content: '✨ Show me everything!',
        });
        const allWidgets: WidgetType[] = ['me', 'experience', 'projects', 'skills', 'awards', 'fun', 'contact'];
        for (let i = 0; i < allWidgets.length; i++) {
          await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 1000));
          handleNavigate(allWidgets[i], true); // Skip hash update to prevent double trigger
        }
        break;
      }
      case 'secret': {
        // Random easter egg question
        const secretQ = getRandomEasterEgg();
        handleQuestionClick(secretQ);
        break;
      }
    }
  }, [addMessage, handleQuestionClick]);

  // Handle pill click (can be question or special action)
  const handlePillClick = useCallback((pill: Pill) => {
    if (pill.action) {
      handleSpecialAction(pill.action);
    } else {
      // Add user message with the pill text
      addMessage({
        type: 'user',
        content: pill.text,
      });

      // Send to chat API for AI response
      setTyping(true);
      handleSendMessage(pill.text).finally(() => {
        setTyping(false);
      });
    }
  }, [addMessage, handleSendMessage, setTyping, handleSpecialAction]);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prev => !prev);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setCurrentInput(value);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onOpenDrawer: toggleDrawer,
    onRandomQuestion: () => {
      const randomQ = getRandomQuestion();
      handleQuestionClick(randomQ);
    },
    onNavigatePills: (direction) => {
      // This would require exposing state from FloatingPills, keeping simple for now
      console.log('Navigate pills:', direction);
    },
  });

  return (
    <div className="flex flex-col h-screen w-screen relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      {/* WebGL Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {theme === 'light' ? (
          <LightVeil 
            speed={0.4}
            hueShift={0}
            noiseIntensity={0.02}
            scanlineIntensity={0}
            warpAmount={0.4}
            resolutionScale={1}
          />
        ) : (
          <DarkVeil 
            speed={0.3}
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            warpAmount={0.5}
            resolutionScale={1}
            theme={theme}
          />
        )}
      </div>
      
      {/* Overlay for better contrast */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ 
        width: '100vw', 
        height: '100vh',
        background: theme === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.4)'
      }} />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 glass-card"
        style={{ 
          borderBottom: `1px solid var(--border-color)`,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Arjun <span className="text-gradient">Mishra</span>
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>AI Research Assistant @ UBC</p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedThemeToggler duration={800} />
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <MessageList onNavigate={handleNavigate} />

      {/* Contextual Suggestions (appears when typing) */}
      <ContextualSuggestions 
        userInput={currentInput}
        onSuggestionClick={handleQuestionClick}
      />

      {/* Floating Pills (above input) */}
      {messages.length > 2 && (
        <FloatingPills onPillClick={handlePillClick} />
      )}

      {/* Input */}
      <div className="relative z-20">
        <ChatInput 
          onSendMessage={handleSendMessage}
          onInputChange={handleInputChange}
        />
      </div>

      {/* Suggestions FAB */}
      <SuggestionsFAB 
        onClick={toggleDrawer}
        isOpen={drawerOpen}
      />

      {/* Suggestions Drawer */}
      <SuggestionsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onQuestionClick={handleQuestionClick}
      />

      {/* Keyboard Shortcuts Hint */}
      <ShortcutsHint />
    </div>
  );
}

function ChatContainerWithProviders() {
  return (
    <ChatProvider>
      <ChatContainerInner />
    </ChatProvider>
  );
}

export function ChatContainer() {
  return (
    <ThemeProvider>
      <ChatContainerWithProviders />
    </ThemeProvider>
  );
}
