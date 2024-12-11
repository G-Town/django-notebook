import { useTheme } from "../context/useTheme";

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="theme-selector">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="btn"
      >
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption.replace("theme-", "").replace("-", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
