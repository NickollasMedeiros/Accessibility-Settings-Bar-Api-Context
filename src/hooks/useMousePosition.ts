"use client";

import { useEffect, useState } from "react";

export interface MousePosition {
	x: number;
	y: number;
}

export const useMousePosition = (isActive: boolean): MousePosition => {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!isActive) return;

		let animationFrame = 0;
		let nextPosition: MousePosition | null = null;

		const handleMouseMove = (e: MouseEvent) => {
			nextPosition = { x: e.clientX, y: e.clientY };
			if (animationFrame) return;

			animationFrame = window.requestAnimationFrame(() => {
				if (nextPosition) setPosition(nextPosition);
				animationFrame = 0;
			});
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
		};
	}, [isActive]);

	return position;
};
