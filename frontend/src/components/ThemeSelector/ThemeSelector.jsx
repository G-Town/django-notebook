import { useTheme } from "../../context/useTheme";
import "./ThemeSelector.css";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme.includes("dark");
  const isAlt = theme.includes("alt");

  const handleModeToggle = () => {
    const newMode = isDark ? "light" : "dark";
    const variant = isAlt ? "-alt" : "";
    setTheme(`theme-${newMode}${variant}`);
  };

  const handleVariantToggle = () => {
    const mode = isDark ? "dark" : "light";
    const newVariant = isAlt ? "" : "-alt";
    // console.log("🚀 ~ handleVariantToggle ~ newVariant:", newVariant);
    setTheme(`theme-${mode}${newVariant}`);
  };

  return (
    <div className="theme-selector">
      {/* <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="btn"
      >
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption.replace("theme-", "").replace("-", " ")}
          </option>
        ))}
      </select> */}
      <button
        className={`toggle-button ${isDark ? "dark" : ""} ${
          isAlt ? "alt" : ""
        }`}
        onClick={handleModeToggle}
        aria-label="Toggle dark mode"
      >
        {/* Sun icon */}
        <svg
          className="sun-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            // stroke="#000"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v1m0 16v1m-9-9h1m16 0h1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />
          </g>
        </svg>
        {/* Moon icon */}
        <svg
          className="moon-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            // stroke="#000"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"
          />
        </svg>
      </button>
      <button
        className={`toggle-button ${isAlt ? "alt" : ""}`}
        onClick={handleVariantToggle}
        aria-label="Toggle theme variant"
      >
        {/* Brush icon */}
        <svg
        className="brush-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m14.622 17.897l-10.68-2.913M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0zM9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"
          />
        </svg>
      </button>
    </div>
  );
};

export default ThemeSelector;
