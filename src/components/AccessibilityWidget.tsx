"use client";

// Widget flutuante que transforma a API do contexto em controles acessíveis.
import React, { useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useAccessibility } from "./AccessibilityContext";
import { useMousePosition } from "../hooks/useMousePosition";
import {
  UserCircleIcon,
  ArrowPathIcon,
  Bars4Icon,
  XMarkIcon,
  LanguageIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

export interface AccessibilityWidgetProps {
  /** Canto da tela onde o botão e o menu serão posicionados. */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Classes Tailwind aplicadas ao botão principal e aos controles ativos. */
  primaryColor?: string;
  /** Classes adicionais para o container fixo do widget. */
  className?: string;
}

/** Renderiza linhas de leitura, menu de preferências e botão flutuante. */
export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  position = "bottom-right",
  primaryColor = "bg-red-600 hover:bg-red-700",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const wasOpen = useRef(false);
  const {
    dyslexiaFont,
    highlightLinks,
    readingLine,
    toggleDyslexiaFont,
    toggleHighlightLinks,
    toggleReadingLine,
    resetAccessibility,
  } = useAccessibility();

  const mousePosition = useMousePosition(readingLine);

  // Classes separadas permitem manter o posicionamento do menu alinhado ao trigger.
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

  useEffect(() => {
	// Gerencia foco e Escape para que o menu também seja operável pelo teclado.
    if (isOpen) {
      wasOpen.current = true;
      menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }

    if (wasOpen.current) {
      triggerRef.current?.focus();
    }

    wasOpen.current = isOpen;
  }, [isOpen]);

  /** Alterna a visibilidade do painel de controles. */
  const toggleOpen = () => setIsOpen((open) => !open);

  return (
    <>
      {/* Linha fina que acompanha o cursor quando readingLine está ativo. */}
      {readingLine && (
        <div
          className="fixed left-0 w-full h-2 bg-red-600 z-[9999] pointer-events-none opacity-100"
          style={{ top: `${mousePosition.y}px` }}
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
        {/* Painel com os controles de acessibilidade. */}
        <div
          ref={menuRef}
          className={twMerge(
            "absolute transition-all duration-300 ease-in-out w-64 bg-gray-900/90 rounded-lg shadow-2xl overflow-y-auto max-h-[80vh] p-2",
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 translate-y-4 invisible pointer-events-none",
            menuPositionClasses[position]
          )}
          id={menuId}
          role="dialog"
          aria-labelledby={`${menuId}-title`}
          aria-label="Menu de acessibilidade"
        >
          <h2 id={`${menuId}-title`} className="sr-only">
            Opções de acessibilidade
          </h2>
          <div className="flex flex-col gap-1">
            <WidgetButton
              icon={<LanguageIcon className="w-5 h-5" />}
              label="Fonte dislexia"
              onClick={toggleDyslexiaFont}
              active={dyslexiaFont}
              isToggle
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<LinkIcon className="w-5 h-5" />}
              label="Destacar links"
              onClick={toggleHighlightLinks}
              active={highlightLinks}
              isToggle
              primaryColor={primaryColor}
            />
            <WidgetButton
              icon={<Bars4Icon className="w-5 h-5" />}
              label="Linha de leitura"
              onClick={toggleReadingLine}
              active={readingLine}
              isToggle
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

        {/* Botão que abre e fecha o painel. */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleOpen}
          className={twMerge(
            "flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50",
            primaryColor
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={menuId}
          aria-label={isOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
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
  isToggle?: boolean;
  primaryColor?: string;
}

/** Botão reutilizável para ações simples e opções booleanas do widget. */
const WidgetButton: React.FC<WidgetButtonProps> = ({
  icon,
  label,
  onClick,
  active,
  isToggle = false,
  primaryColor,
}) => {
  return (
    <button
      type="button"
      aria-pressed={isToggle ? active : undefined}
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-3 w-full p-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800 bg-gray-200 hover:bg-white",
        active &&
          clsx(
            "text-white hover:text-white",
            primaryColor,
          )
      )}
    >
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded text-white bg-red-600",
          primaryColor
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
};
