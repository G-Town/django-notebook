import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notebook from "./pages/Notebook";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import "./styles/App.css";

function Logout() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" />;
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
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/register" element={<RegisterAndLogout />} />
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
