import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../index";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavbar = true,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  if (!showNavbar) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <nav className="navbar">
        <Logo size="medium" />
        <div className="nav-links">
          {isAuthenticated && user ? (
            <>
              <Link to="/vacancies">Vagas</Link>
              {user.vacancies && user.vacancies.length > 0 && (
                <Link to="/people">Pessoas</Link>
              )}
              <Link to="/matches">Matches</Link>
              <Link to="/create-room">Cadastrar Vaga</Link>
              <Link to={`/profile/${user.id}`}>Meu Perfil</Link>
              <div className="user-info">
                <span>Olá, {user.name || "Usuário"}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
