import React, { useEffect } from "react";

export const useEscape = (onEscape: () => void) => {
    useEffect(() => {
        const handleEsc = (event: { keyCode: number }) => {
            if (event.keyCode === 27) onEscape();
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);
};
