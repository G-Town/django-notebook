import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notebook from "./pages/Notebook";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header/";
// import Sidebar from "./components/Sidebar";
import "./styles/App.css";

function Logout() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  // TODO: better registration
  return <Register />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <div className="content-container">
              {/* <Sidebar /> */}
              <div className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/register" element={<RegisterAndLogout />} />
                  {/* Protected Routes */}
                  <Route
                    path="/notebook"
                    element={
                      <ProtectedRoute>
                        <Notebook />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/import"
                    element={
                      <ProtectedRoute>
                        <Import />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch-all Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
