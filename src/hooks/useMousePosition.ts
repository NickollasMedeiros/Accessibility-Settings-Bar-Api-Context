"use client";

import { useEffect, useState } from "react";

export const useMousePosition = (isActive: boolean) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!isActive) return;

		const handleMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isActive]);

	return position;
};
