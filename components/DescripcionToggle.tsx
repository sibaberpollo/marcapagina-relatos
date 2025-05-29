"use client";
import { useState } from "react";

export default function DescripcionToggle({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <p className={`text-lg leading-7 text-gray-700 dark:text-gray-300 transition-all ${expanded ? '' : 'line-clamp-2'}`}>{text}</p>
      <button
        className="mt-1 text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Mostrar menos" : "Mostrar más"}
      </button>
    </div>
  );
} 