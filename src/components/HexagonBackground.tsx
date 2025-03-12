import React from "react";

export function HexagonBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
      <svg
        className="absolute left-[50%] top-0 h-[48rem] max-h-full w-[128rem] max-w-[100rem] -translate-x-1/2 overflow-hidden stroke-blue-600/20"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hexagon-pattern"
            width="128"
            height="128"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1 0.866) translate(0 0)"
          >
            <path
              d="M64 0 L128 37 V91 L64 128 L0 91 V37 Z"
              fill="none"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
      </svg>
    </div>
  );
}
