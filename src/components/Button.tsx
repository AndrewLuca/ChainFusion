import React from "react";
import { cn } from "../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
}

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white",
    outline: "bg-transparent border border-gray-700 hover:border-blue-600 text-gray-300 hover:text-white"
  };

  const sizeClasses = {
    default: "py-2 px-4 text-sm",
    sm: "py-1.5 px-3 text-xs",
    lg: "py-3 px-6 text-base"
  };

  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors duration-200 focus:outline-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
