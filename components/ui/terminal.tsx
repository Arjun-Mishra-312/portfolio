"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { cn } from "@/utils/cn";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface TerminalContextType {
  delay: number;
  setDelay: (delay: number) => void;
  startOnView: boolean;
}

const TerminalContext = createContext<TerminalContextType>({
  delay: 0,
  setDelay: () => {},
  startOnView: true,
});

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  sequence?: boolean;
  startOnView?: boolean;
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const [delay, setDelay] = useState(0);

  return (
    <TerminalContext.Provider value={{ delay, setDelay, startOnView }}>
      <div
        className={cn(
          "relative rounded-lg bg-black p-4 font-mono text-sm shadow-2xl",
          "border border-gray-800",
          className
        )}
      >
        {/* Terminal Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        {/* Terminal Content */}
        <div className="space-y-2">
          {sequence
            ? React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    sequenceIndex: index,
                  });
                }
                return child;
              })
            : children}
        </div>
      </div>
    </TerminalContext.Provider>
  );
};

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  sequenceIndex?: number;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  sequenceIndex = 0,
}: TypingAnimationProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const { delay: contextDelay, setDelay: setContextDelay } =
    useContext(TerminalContext);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isVisible = useIntersectionObserver(elementRef, {
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const shouldStart = startOnView ? isVisible : true;
  const actualDelay = contextDelay + delay;

  useEffect(() => {
    if (!shouldStart) return;

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= children.length) {
          setDisplayText(children.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          // Update context delay for next element
          setContextDelay(actualDelay + children.length * duration);
        }
      }, duration);

      return () => clearInterval(interval);
    }, actualDelay);

    return () => clearTimeout(timeout);
  }, [shouldStart, children, duration, actualDelay, setContextDelay]);

  return (
    <Component ref={elementRef} className={cn("text-green-400", className)}>
      {displayText}
      {!isComplete && <span className="animate-pulse">▊</span>}
    </Component>
  );
};

interface AnimatedSpanProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  startOnView?: boolean;
  sequenceIndex?: number;
}

export const AnimatedSpan = ({
  children,
  className,
  delay = 0,
  startOnView = false,
  sequenceIndex = 0,
}: AnimatedSpanProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { delay: contextDelay, setDelay: setContextDelay } =
    useContext(TerminalContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(elementRef, {
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const shouldStart = startOnView ? isInView : true;
  const actualDelay = contextDelay + delay;

  useEffect(() => {
    if (!shouldStart) return;

    const timeout = setTimeout(() => {
      setIsVisible(true);
      // Update context delay for next element (estimate 500ms for display)
      setContextDelay(actualDelay + 500);
    }, actualDelay);

    return () => clearTimeout(timeout);
  }, [shouldStart, actualDelay, setContextDelay]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};
