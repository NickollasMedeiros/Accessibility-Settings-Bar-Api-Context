"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useAccessibility } from "./AccessibilityContext";
import { useMousePosition } from "../hooks/useMousePosition";
import {
  UserCircleIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
  Bars4Icon,
  EyeIcon,
  XMarkIcon,
  LanguageIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

export interface AccessibilityWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  className?: string;
}

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  position = "bottom-right",
  primaryColor = "bg-red-600 hover:bg-red-700",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    darkMode,
    dyslexiaFont,
    highlightLinks,
    readingLine,
    markerLine,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleDarkMode,
    toggleDyslexiaFont,
    toggleHighlightLinks,
    toggleReadingLine,
    toggleMarkerLine,
    resetAccessibility,
  } = useAccessibility();

  const mousePosition = useMousePosition(readingLine || markerLine);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const menuPositionClasses = {
    "bottom-right": "bottom-16 right-0",
    "bottom-left": "bottom-16 left-0",
    "top-right": "top-16 right-0",
    "top-left": "top-16 left-0",
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Reading Line */}
      {readingLine && (
        <div
          className="fixed left-0 w-full h-2 bg-red-600 z-[9999] pointer-events-none opacity-100 a11y-contrast:bg-yellow-400"
          style={{ top: `${mousePosition.y}px` }}
          aria-hidden="true"
        />
      )}

      {/* Marker Line */}
      {markerLine && (
        <div
          className="fixed left-0 w-full h-8 border-y border-y-[#cde400] bg-[#e4fd00] opacity-75 z-[9999] pointer-events-none mix-blend-color a11y-contrast:mix-blend-multiply a11y-contrast:opacity-100 a11y-dark:bg-[#655b5b] a11y-dark:opacity-25 a11y-dark:mix-blend-normal"
          style={{ top: `${mousePosition.y - 16}px` }}
          aria-hidden="true"
        />
      )}

      <div
        className={twMerge(
          "fixed z-[9999] flex flex-col items-end",
          positionClasses[position],
          className
        )}
      >
        {/* Menu */}
        <div
          className={twMerge(
            "absolute transition-all duration-300 ease-in-out w-64 bg-gray-900/90 rounded-lg shadow-2xl overflow-y-auto max-h-[80vh] p-2 a11y-contrast:bg-black a11y-contrast:border-yellow-400 a11y-contrast:border a11y-dark:bg-[#121212] a11y-dark:border-[#191414] a11y-dark:border",
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 translate-y-4 invisible pointer-events-none",
            menuPositionClasses[position]
          )}
          role="menu"
          aria-label="Menu de acessibilidade"
        >
          <div className="flex flex-col gap-1">
            <WidgetButton
              icon={<MagnifyingGlassPlusIcon className="w-5 h-5" />}
              label="Aumentar fonte"
              onClick={increaseFontSize}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<MagnifyingGlassMinusIcon className="w-5 h-5" />}
              label="Diminuir fonte"
              onClick={decreaseFontSize}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<EyeIcon className="w-5 h-5" />}
              label="Alto contraste"
              onClick={toggleHighContrast}
              active={highContrast}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<MoonIcon className="w-5 h-5" />}
              label="Modo escuro"
              onClick={toggleDarkMode}
              active={darkMode}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<LanguageIcon className="w-5 h-5" />}
              label="Fonte dislexia"
              onClick={toggleDyslexiaFont}
              active={dyslexiaFont}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<LinkIcon className="w-5 h-5" />}
              label="Destacar links"
              onClick={toggleHighlightLinks}
              active={highlightLinks}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<Bars4Icon className="w-5 h-5" />}
              label="Linha de leitura"
              onClick={toggleReadingLine}
              active={readingLine}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<Bars4Icon className="w-5 h-5 rotate-90" />}
              label="Linha guia"
              onClick={toggleMarkerLine}
              active={markerLine}
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<ArrowPathIcon className="w-5 h-5" />}
              label="Redefinir"
              onClick={resetAccessibility}
              primaryColor={primaryColor}
            />
          </div>
        </div>

        {/* Floating Button */}
        <button
          type="button"
          onClick={toggleOpen}
          className={twMerge(
            "flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 a11y-contrast:bg-yellow-400 a11y-contrast:text-black a11y-dark:bg-[#292323] a11y-dark:text-[#8d8080]",
            primaryColor
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Abrir menu de acessibilidade"
        >
          {isOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <UserCircleIcon className="w-8 h-8" />
          )}
        </button>
      </div>
    </>
  );
};

interface WidgetButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  primaryColor?: string;
}

const WidgetButton: React.FC<WidgetButtonProps> = ({
  icon,
  label,
  onClick,
  active,
  primaryColor,
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-3 w-full p-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800 bg-gray-200 hover:bg-white a11y-contrast:bg-black a11y-contrast:text-yellow-400 a11y-contrast:border a11y-contrast:border-yellow-400 a11y-contrast:hover:bg-yellow-400 a11y-contrast:hover:text-black a11y-dark:bg-[#191414] a11y-dark:text-[#8d8080] a11y-dark:hover:bg-[#292323]",
        active &&
          clsx(
            "text-white hover:text-white",
            primaryColor,
            "a11y-contrast:bg-yellow-400 a11y-contrast:text-black a11y-dark:bg-[#121212] a11y-dark:text-white"
          )
      )}
    >
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded text-white bg-red-600 a11y-contrast:bg-yellow-400 a11y-contrast:text-black a11y-dark:bg-[#292323] a11y-dark:text-[#8d8080]",
          primaryColor
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
};
