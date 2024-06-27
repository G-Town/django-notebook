import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NoteForm from "./pages/NoteForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function Logout() {
  // localStorage.clear();
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  // TODO: better registration
  // localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
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
            path="/note/:noteID"
            element={
              <ProtectedRoute>
                <NoteForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/note/new"
            element={
              <ProtectedRoute>
                <NoteForm />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
