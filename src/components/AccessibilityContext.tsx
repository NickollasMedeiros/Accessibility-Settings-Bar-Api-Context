"use client";

// Contexto client-side que concentra as preferências de acessibilidade,
// sua persistência e a sincronização dos estados com o elemento <html>.
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface AccessibilitySettings {
	/** Preferência de tamanho da fonte, em porcentagem, limitada entre 40 e 200. */
	fontSize: number;
	/** Alto contraste e modo escuro são opções mutuamente exclusivas. */
	highContrast: boolean;
	darkMode: boolean;
	/** Ativa espaçamento maior e a fonte definida pelos estilos globais. */
	dyslexiaFont: boolean;
	/** Destaca todos os links por meio de CSS global. */
	highlightLinks: boolean;
	/** Exibe uma linha fina seguindo a posição vertical do mouse. */
	readingLine: boolean;
	/** Exibe uma faixa maior para ajudar a acompanhar a leitura. */
	markerLine: boolean;
}

export interface AccessibilityContextProps extends AccessibilitySettings {
	/** Ações públicas consumidas pelo widget e por controles personalizados. */
	increaseFontSize: () => void;
	decreaseFontSize: () => void;
	resetFontSize: () => void;
	toggleHighContrast: () => void;
	toggleDarkMode: () => void;
	toggleDyslexiaFont: () => void;
	toggleHighlightLinks: () => void;
	toggleReadingLine: () => void;
	toggleMarkerLine: () => void;
	resetAccessibility: () => void;
}

export interface AccessibilityProviderProps {
	/** Conteúdo que poderá acessar as preferências. */
	children: ReactNode;
	/** Preferências iniciais usadas quando não há valores persistidos. */
	initialSettings?: Partial<AccessibilitySettings>;
	/** Define se as preferências devem ser lidas e salvas no localStorage. */
	persist?: boolean;
	/** Chave usada para armazenar o JSON das preferências. */
	storageKey?: string;
}

/** Valores aplicados quando nenhuma preferência personalizada foi informada. */
export const defaultAccessibilitySettings: AccessibilitySettings = {
	fontSize: 100,
	highContrast: false,
	darkMode: false,
	dyslexiaFont: false,
	highlightLinks: false,
	readingLine: false,
	markerLine: false,
};

const booleanSettingKeys: Array<keyof AccessibilitySettings> = [
	"highContrast",
	"darkMode",
	"dyslexiaFont",
	"highlightLinks",
	"readingLine",
	"markerLine",
];

/** Preenche valores ausentes, limita a fonte e remove combinações incompatíveis. */
export const normalizeAccessibilitySettings = (
	settings: Partial<AccessibilitySettings> | null | undefined,
): AccessibilitySettings => {
	const normalized: AccessibilitySettings = {
		...defaultAccessibilitySettings,
	};

	if (typeof settings?.fontSize === "number" && Number.isFinite(settings.fontSize)) {
		normalized.fontSize = Math.min(Math.max(settings.fontSize, 40), 200);
	}

	for (const key of booleanSettingKeys) {
		if (typeof settings?.[key] === "boolean") {
			(normalized as unknown as Record<string, boolean | number>)[key] = settings[key] as boolean;
		}
	}

	if (normalized.highContrast) {
		normalized.darkMode = false;
	}

	return normalized;
};

const AccessibilityContext = createContext<
	AccessibilityContextProps | undefined
>(undefined);

export const AccessibilityProvider = ({
	children,
	initialSettings,
	persist = true,
	storageKey = "a11y-settings",
}: AccessibilityProviderProps) => {
	// O primeiro render é determinístico para evitar diferenças entre servidor e cliente.
	const [settings, setSettings] = useState<AccessibilitySettings>(() =>
		normalizeAccessibilitySettings(initialSettings),
	);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// Recupera preferências somente no navegador, depois da hidratação.
		if (!persist) {
			queueMicrotask(() => setIsHydrated(true));
			return;
		}

		try {
			const stored = window.localStorage.getItem(storageKey);
			if (stored) {
				const parsed: unknown = JSON.parse(stored);
				queueMicrotask(() => {
					setSettings((current) =>
						normalizeAccessibilitySettings({
							...current,
							...(parsed && typeof parsed === "object" ? parsed : {}),
						}),
					);
				});
			}
		} catch {
			try {
				window.localStorage.removeItem(storageKey);
			} catch {
				return;
			}
		} finally {
			queueMicrotask(() => setIsHydrated(true));
		}
	}, [persist, storageKey]);

	useEffect(() => {
		// Não grava o estado inicial antes de terminar a leitura do localStorage.
		if (!persist || !isHydrated) return;

		try {
			window.localStorage.setItem(storageKey, JSON.stringify(settings));
		} catch {
			return;
		}
	}, [isHydrated, persist, settings, storageKey]);

	useEffect(() => {
		// Converte o estado React em font-size e atributos consumidos pelo CSS/Tailwind.
		const html = document.documentElement;

		html.style.fontSize = `${settings.fontSize}%`;

		if (settings.highContrast) {
			html.setAttribute("data-a11y-contrast", "true");
		} else {
			html.removeAttribute("data-a11y-contrast");
		}

		if (settings.darkMode) {
			html.setAttribute("data-a11y-dark", "true");
		} else {
			html.removeAttribute("data-a11y-dark");
		}

		if (settings.dyslexiaFont) {
			html.setAttribute("data-a11y-dyslexia", "true");
		} else {
			html.removeAttribute("data-a11y-dyslexia");
		}

		if (settings.highlightLinks) {
			html.setAttribute("data-a11y-highlight-links", "true");
		} else {
			html.removeAttribute("data-a11y-highlight-links");
		}

		if (settings.readingLine) {
			html.setAttribute("data-a11y-reading-line", "true");
		} else {
			html.removeAttribute("data-a11y-reading-line");
		}

		if (settings.markerLine) {
			html.setAttribute("data-a11y-marker-line", "true");
		} else {
			html.removeAttribute("data-a11y-marker-line");
		}
	}, [settings]);

	const increaseFontSize = () => {
		setSettings((prev) => ({
			...prev,
			fontSize: Math.min(prev.fontSize + 20, 200), // Max 200%
		}));
	};

	const decreaseFontSize = () => {
		setSettings((prev) => ({
			...prev,
			fontSize: Math.max(prev.fontSize - 20, 40), // Min 40%
		}));
	};

	const resetFontSize = () => {
		setSettings((prev) => ({ ...prev, fontSize: 100 }));
	};

	const toggleHighContrast = () => {
		setSettings((prev) => {
			const newState = !prev.highContrast;
			// If turning ON highContrast, turn OFF darkMode to prevent conflicts
			return {
				...prev,
				highContrast: newState,
				darkMode: newState ? false : prev.darkMode,
			};
		});
	};

	const toggleDarkMode = () => {
		setSettings((prev) => {
			const newState = !prev.darkMode;
			// If turning ON darkMode, turn OFF highContrast to prevent conflicts
			return {
				...prev,
				darkMode: newState,
				highContrast: newState ? false : prev.highContrast,
			};
		});
	};

	const toggleDyslexiaFont = () => {
		setSettings((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
	};

	const toggleHighlightLinks = () => {
		setSettings((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks }));
	};

	const toggleReadingLine = () => {
		setSettings((prev) => ({ ...prev, readingLine: !prev.readingLine }));
	};

	const toggleMarkerLine = () => {
		setSettings((prev) => ({ ...prev, markerLine: !prev.markerLine }));
	};

	const resetAccessibility = () => {
		setSettings(normalizeAccessibilitySettings(initialSettings));
	};

	return (
		<AccessibilityContext.Provider
			value={{
				...settings,
				increaseFontSize,
				decreaseFontSize,
				resetFontSize,
				toggleHighContrast,
				toggleDarkMode,
				toggleDyslexiaFont,
				toggleHighlightLinks,
				toggleReadingLine,
				toggleMarkerLine,
				resetAccessibility,
			}}
		>
			{children}
		</AccessibilityContext.Provider>
	);
};

export const useAccessibility = () => {
	/** Retorna a API de acessibilidade e exige um provider na árvore React. */
	const context = useContext(AccessibilityContext);
	if (context === undefined) {
		throw new Error(
			"useAccessibility must be used within an AccessibilityProvider",
		);
	}
	return context;
};
