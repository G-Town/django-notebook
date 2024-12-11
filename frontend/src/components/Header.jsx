import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import ThemeSelector from "./ThemeSelector";
import { Icons } from "../utils/lucideIcons";
import "../styles/Header.css";

function Header() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav">
        {isAuthenticated ? (
          <>
            <ul>
              <li>
                <Link to="/">
                  <img src={Icons.home} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/notebook">
                  <img src={Icons.notebook} />
                  Notebook
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <ThemeSelector />
              </li>
              <li>
                <Link to="/logout">
                  <img src={Icons.logout} />
                  Logout
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <>
          <Link>
          </Link>
            <ul>
              <li>
                <Link to="/login">
                  <img src={Icons.login} />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <img src={Icons.register} />
                  Register
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
