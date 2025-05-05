import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const THEMES = [
  "theme-light",
  "theme-dark",
  "theme-light-alt",
  "theme-dark-alt",
];

export const ThemeContext = createContext({
  theme: "theme-light",
  setTheme: () => {}, // placeholder
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "theme-light";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
