"use client";

import React from "react";
import { cn } from "@/utils/cn";

type SafariMode = "default" | "simple";

interface SafariProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  imageSrc?: string;
  videoSrc?: string;
  mode?: SafariMode;
}

export const Safari = ({
  url,
  imageSrc,
  videoSrc,
  mode = "default",
  className,
  style,
  ...props
}: SafariProps) => {
  const handleClick = () => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={cn(
        "relative w-full",
        "aspect-[1203/753]",
        className
      )}
      style={style}
      {...props}
    >
      <svg
        viewBox="0 0 1203 753"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <mask id="safari-mask">
            <rect width="1203" height="753" fill="white" rx="12" />
          </mask>
        </defs>

        {/* Browser Frame */}
        <g mask="url(#safari-mask)">
          {/* Background */}
          <rect
            width="1203"
            height="753"
            fill="#1a1a1a"
            rx="12"
          />

          {/* Top Bar */}
          {mode === "default" && (
            <>
              <rect
                width="1203"
                height="52"
                fill="#2d2d2d"
              />

              {/* Traffic Lights */}
              <circle cx="24" cy="26" r="6" fill="#ff5f57" />
              <circle cx="44" cy="26" r="6" fill="#febc2e" />
              <circle cx="64" cy="26" r="6" fill="#28c840" />

              {/* Address Bar */}
              <rect
                x="96"
                y="14"
                width="1011"
                height="28"
                rx="6"
                fill="#3a3a3a"
              />

              {/* URL Text */}
              <text
                x="116"
                y="33"
                fill="#9ca3af"
                fontSize="14"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {url}
              </text>
            </>
          )}

          {/* Content Area */}
          {(imageSrc || videoSrc) && (
            <foreignObject
              x="0"
              y={mode === "default" ? "52" : "0"}
              width="1203"
              height={mode === "default" ? "701" : "753"}
            >
              <div
                className={cn(
                  "h-full w-full overflow-hidden",
                  url && url !== "#" ? "cursor-pointer" : ""
                )}
                onClick={handleClick}
              >
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt="Safari content"
                    className="h-full w-full object-cover"
                  />
                )}
                {videoSrc && (
                  <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </foreignObject>
          )}
        </g>

        {/* Border */}
        <rect
          width="1203"
          height="753"
          rx="12"
          stroke="#404040"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
};
