import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useTheme } from "../../context/useTheme";
import ThemeSelector from "../ThemeSelector";
// import { Icons } from "../utils/lucideIcons";
import logo from "../../assets/logo-light2.png";
import "./Header.css"

function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useTheme();
  const isAltTheme = theme.includes("alt");
  // const isLightTheme = theme.include("light");
  // console.log("🚀 ~ Header ~ isAltTheme:", isAltTheme);
  const themeClass = isAltTheme ? "alt-theme-icon" : "default-theme-icon";
  // console.log("🚀 ~ Header ~ themeClass:", themeClass);

  const NavItems = () => (
    <nav className="nav-list">
      <Link to="/" className={`icon-wrapper ${themeClass}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </g>
        </svg>
        Home
      </Link>
      <Link to="/notebook" className={`icon-wrapper ${themeClass}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <path d="M2 6h4m-4 4h4m-4 4h4m-4 4h4" />
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M16 2v20" />
          </g>
        </svg>
        Notebook
      </Link>
      <Link to="/import" className={`icon-wrapper ${themeClass}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <path d="M12 3v12m-4-4l4 4l4-4" />
            <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
          </g>
        </svg>
        Import
      </Link>
    </nav>
  );

  return (
    <header className="site-header">
      {isAuthenticated && <NavItems />}
      <Link to="/">
        <img src={logo} alt="Site Logo" className="logo" />
      </Link>
      <ul className="util-list">
        <li>
          <ThemeSelector />
        </li>
        {isAuthenticated ? (
          <li>
            <Link to="/logout" className={`icon-wrapper ${themeClass}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9"
                />
              </svg>
              Logout
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className={`icon-wrapper ${themeClass}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5l-5-5m5 5H3"
                  />
                </svg>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={`icon-wrapper ${themeClass}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6m3-3h-6" />
                  </g>
                </svg>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
