"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface AccessibilitySettings {
	fontSize: number; // percentage, default 100
	highContrast: boolean;
	darkMode: boolean;
	dyslexiaFont: boolean;
	highlightLinks: boolean;
	readingLine: boolean;
	markerLine: boolean;
}

export interface AccessibilityContextProps extends AccessibilitySettings {
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

const defaultSettings: AccessibilitySettings = {
	fontSize: 100,
	highContrast: false,
	darkMode: false,
	dyslexiaFont: false,
	highlightLinks: false,
	readingLine: false,
	markerLine: false,
};

const AccessibilityContext = createContext<
	AccessibilityContextProps | undefined
>(undefined);

export const AccessibilityProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [settings, setSettings] = useState<AccessibilitySettings>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("a11y-settings");
			if (stored) {
				try {
					return { ...defaultSettings, ...JSON.parse(stored) };
				} catch (e) {
					console.error(e);
				}
			}
		}
		return defaultSettings;
	});

	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		setIsInitialized(true);
	}, []);

	// Sync to localStorage
	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem("a11y-settings", JSON.stringify(settings));
		}
	}, [settings, isInitialized]);

	// Apply attributes to HTML
	useEffect(() => {
		if (!isInitialized) return;

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
	}, [settings, isInitialized]);

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
		setSettings(defaultSettings);
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
	const context = useContext(AccessibilityContext);
	if (context === undefined) {
		throw new Error(
			"useAccessibility must be used within an AccessibilityProvider",
		);
	}
	return context;
};
