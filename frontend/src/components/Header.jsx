import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
// import "./Header.css";

function Header() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav">
        {isAuthenticated ? (
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;
