import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage"; 
import ResetPasswordPage from "./pages/ResetPasswordPage";

function getResetToken() {
  const match = window.location.pathname.match(/^\/reset-password\/(.+)$/);
  return match ? match[1] : null;
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [resetToken, setResetToken] = useState(getResetToken);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleBackToLogin = () => {
    window.history.pushState({}, "", "/");
    setResetToken(null);
  };

  // Show reset password page if on /reset-password/:token
  if (resetToken) {
    return <ResetPasswordPage token={resetToken} onBackToLogin={handleBackToLogin} />;
  }

  if (user) {
    return <Dashboard onLogout={handleLogout} user={user} />;
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

export default App;