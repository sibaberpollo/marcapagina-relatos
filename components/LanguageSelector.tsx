"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import CustomLink from "./Link";

const multiLangPaths = ["/memes-merch-descargas"];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const pathNoLocale = pathname.startsWith("/en/")
    ? pathname.replace("/en", "")
    : pathname;

  const hasTranslation = multiLangPaths.includes(pathNoLocale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!hasTranslation) return null;

  const currentLabel = pathname.startsWith("/en/") ? "EN" : "ES";

  const options = [
    { label: "ES", href: pathNoLocale },
    { label: "EN", href: `/en${pathNoLocale}` },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors"
        aria-label="Seleccionar idioma"
      >
        {currentLabel}
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-20 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
          {options.map((opt) => (
            <CustomLink
              key={opt.label}
              href={opt.href}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              {opt.label}
            </CustomLink>
          ))}
        </div>
      )}
    </div>
  );
}
