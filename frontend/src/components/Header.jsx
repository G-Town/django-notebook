import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";

function Header() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav">
        {isAuthenticated ? (
          <ul>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login">
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FontAwesomeIcon icon={faUserPlus} /> Register
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;
