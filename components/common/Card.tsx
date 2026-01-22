
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={cn("bg-white rounded-3xl p-6 border border-gray-100 shadow-sm", className)}>
      {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
      {children}
    </div>
  );
};
