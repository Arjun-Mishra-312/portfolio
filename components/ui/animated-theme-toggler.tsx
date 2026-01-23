"use client";

import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { flushSync } from "react-dom";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/utils/cn";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"div"> {
  duration?: number;
}

export function AnimatedThemeToggler({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) {
  const { theme, setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(async () => {
    if (!containerRef.current) return;

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support View Transitions
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } = containerRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [theme, setTheme, duration]);

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className={cn("relative", className)} style={{ fontSize: '6px' }} {...props}>
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="hidden"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      />
      
      {/* Container */}
      <motion.div
        className="relative cursor-pointer overflow-hidden"
        style={{
          width: '5.625em',
          height: '2.5em',
          borderRadius: '6.25em',
          boxShadow: '0em -0.062em 0.062em rgba(0, 0, 0, 0.25), 0em 0.062em 0.125em rgba(255, 255, 255, 0.94)',
        }}
        animate={{
          backgroundColor: isDark ? '#1D1F2C' : '#3D7EAE'
        }}
        transition={{ duration: 0.5, ease: [0, -0.02, 0.4, 1.25] }}
        onClick={toggleTheme}
      >
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            borderRadius: '6.25em',
            boxShadow: '0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset, 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset'
          }}
        />

        {/* Stars (Dark Mode) */}
        <motion.svg
          className="absolute text-white"
          style={{
            left: '0.312em',
            width: '2.75em',
            height: 'auto',
          }}
          animate={{
            top: isDark ? '50%' : '-100%',
            y: isDark ? '-50%' : '0%'
          }}
          transition={{ duration: 0.5, ease: [0, -0.02, 0.4, 1.25] }}
          viewBox="0 0 50 20"
        >
          <circle cx="5" cy="5" r="1" fill="currentColor" />
          <circle cx="15" cy="8" r="1.5" fill="currentColor" />
          <circle cx="25" cy="4" r="1" fill="currentColor" />
          <circle cx="32" cy="10" r="1.2" fill="currentColor" />
          <circle cx="40" cy="6" r="0.8" fill="currentColor" />
        </motion.svg>

        {/* Circle Container */}
        <motion.div
          className="absolute flex pointer-events-none"
          style={{
            width: '3.375em',
            height: '3.375em',
            top: 'calc((3.375em - 2.5em) / 2 * -1)',
            borderRadius: '6.25em',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), 0 0 0 0.625em rgba(255, 255, 255, 0.1), 0 0 0 1.25em rgba(255, 255, 255, 0.1)',
          }}
          animate={{
            left: isDark ? 'calc(100% - calc((3.375em - 2.5em) / 2 * -1) - 3.375em)' : 'calc((3.375em - 2.5em) / 2 * -1)'
          }}
          transition={{ duration: 0.3, ease: [0, -0.02, 0.35, 1.17] }}
        >
          {/* Sun/Moon */}
          <div
            className="relative m-auto overflow-hidden pointer-events-auto"
            style={{
              width: '2.125em',
              height: '2.125em',
              borderRadius: '6.25em',
              backgroundColor: '#ECCA2F',
              boxShadow: '0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset',
              filter: 'drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25)) drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25))',
            }}
          >
            {/* Moon */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundColor: '#C4C9D1',
                borderRadius: 'inherit',
                boxShadow: '0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #969696 inset',
              }}
              animate={{
                x: isDark ? '0%' : '100%'
              }}
              transition={{ duration: 0.5, ease: [0, -0.02, 0.4, 1.25] }}
            >
              {/* Moon Spots */}
              <div
                className="absolute rounded-full"
                style={{
                  top: '0.75em',
                  left: '0.312em',
                  width: '0.75em',
                  height: '0.75em',
                  backgroundColor: '#959DB1',
                  boxShadow: '0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: '0.375em',
                  height: '0.375em',
                  top: '0.937em',
                  left: '1.375em',
                  backgroundColor: '#959DB1',
                  boxShadow: '0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: '0.25em',
                  height: '0.25em',
                  top: '0.312em',
                  left: '0.812em',
                  backgroundColor: '#959DB1',
                  boxShadow: '0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset',
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Clouds (Light Mode) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '1.25em',
            height: '1.25em',
            backgroundColor: '#F3FDFF',
            left: '0.312em',
            boxShadow: `
              0.937em 0.312em #F3FDFF, 
              -0.312em -0.312em #AACADF, 
              1.437em 0.375em #F3FDFF, 
              0.5em -0.125em #AACADF, 
              2.187em 0 #F3FDFF, 
              1.25em -0.062em #AACADF, 
              2.937em 0.312em #F3FDFF, 
              2em -0.312em #AACADF, 
              3.625em -0.062em #F3FDFF, 
              2.625em 0em #AACADF, 
              4.5em -0.312em #F3FDFF, 
              3.375em -0.437em #AACADF, 
              4.625em -1.75em 0 0.437em #F3FDFF, 
              4em -0.625em #AACADF, 
              4.125em -2.125em 0 0.437em #AACADF
            `,
          }}
          animate={{
            bottom: isDark ? '-4.062em' : '-0.625em'
          }}
          transition={{ duration: 0.5, ease: [0, -0.02, 0.4, 1.25] }}
        />
      </motion.div>
    </div>
  );
}
