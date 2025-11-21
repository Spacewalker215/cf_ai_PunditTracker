"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={styles.toggleButton}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}
