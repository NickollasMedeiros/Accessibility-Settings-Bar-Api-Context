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
	/** Ativa espaçamento maior e a fonte definida pelos estilos globais. */
	dyslexiaFont: boolean;
	/** Destaca todos os links por meio de CSS global. */
	highlightLinks: boolean;
	/** Exibe uma linha fina seguindo a posição vertical do mouse. */
	readingLine: boolean;
}

export interface AccessibilityContextProps extends AccessibilitySettings {
	/** Ações públicas consumidas pelo widget e por controles personalizados. */
	toggleDyslexiaFont: () => void;
	toggleHighlightLinks: () => void;
	toggleReadingLine: () => void;
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
	dyslexiaFont: false,
	highlightLinks: false,
	readingLine: false,
};

const booleanSettingKeys: Array<keyof AccessibilitySettings> = [
	"dyslexiaFont",
	"highlightLinks",
	"readingLine",
];

/** Preenche valores ausentes e ignora propriedades fora da API pública. */
export const normalizeAccessibilitySettings = (
	settings: Partial<AccessibilitySettings> | null | undefined,
): AccessibilitySettings => {
	const normalized: AccessibilitySettings = {
		...defaultAccessibilitySettings,
	};

	for (const key of booleanSettingKeys) {
		if (typeof settings?.[key] === "boolean") {
			(normalized as unknown as Record<string, boolean | number>)[key] = settings[key] as boolean;
		}
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
		// Converte o estado React nos atributos consumidos pelo CSS e pelo widget.
		const html = document.documentElement;

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
	}, [settings]);

	const toggleDyslexiaFont = () => {
		setSettings((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
	};

	const toggleHighlightLinks = () => {
		setSettings((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks }));
	};

	const toggleReadingLine = () => {
		setSettings((prev) => ({ ...prev, readingLine: !prev.readingLine }));
	};

	const resetAccessibility = () => {
		setSettings(normalizeAccessibilitySettings(initialSettings));
	};

	return (
		<AccessibilityContext.Provider
			value={{
				...settings,
				toggleDyslexiaFont,
				toggleHighlightLinks,
				toggleReadingLine,
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
