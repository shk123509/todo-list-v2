
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
  <nav className="navbar fixed-top navbar-expand-lg" style={{
        background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        padding: '0.8rem 2rem',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container-fluid" style={{gap: '2rem'}}>
          <Link className="navbar-brand" to="/NewsMonkey" style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span role="img" aria-label="news">📰</span>NewsBoard
          </Link>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              border: 'none',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          >
            <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{gap: '1.2rem'}}>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/" style={{
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  '&:hover': { background: 'rgba(255,255,255,0.1)' }
                }}>
                  <span role="img" aria-label="home" style={{marginRight: '0.5rem'}}>🏠</span>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" style={{color: '#fff', transition: '0.2s'}}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/business" style={{color: '#fff', transition: '0.2s'}}>
                  Business
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/entertainment" style={{color: '#fff', transition: '0.2s'}}>
                  Entertainment
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/general" style={{color: '#fff', transition: '0.2s'}}>
                  General
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/health" style={{color: '#fff', transition: '0.2s'}}>
                  Health
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/technology" style={{color: '#fff', transition: '0.2s'}}>
                  Technology
                </Link>
              </li>
            </ul>
            <div className="mx-3" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              {!isAuthenticated ? (
                <>
                  <Link className="btn btn-light mx-1" to="/login" role="button" style={{
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span role="img" aria-label="login" style={{marginRight: '0.5rem'}}>🔑</span>Login
                  </Link>
                  <Link className="btn btn-light mx-1" to="/signup" role="button" style={{
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span role="img" aria-label="signup" style={{marginRight: '0.5rem'}}>📝</span>Signup
                  </Link>
                </>
              ) : (
                <>
                  <span className="navbar-text mx-2" style={{color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{display: 'inline-block', width: 32, height: 32, borderRadius: '50%', background: '#fff', color: '#4e54c8', fontWeight: 'bold', textAlign: 'center', lineHeight: '32px', fontSize: '1.2rem'}}>
                      {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    Welcome{user ? `, ${user.name}` : ""}!
                  </span>
                  <Link className="btn btn-warning mx-1" to="/profile" role="button" style={{
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.3s ease',
                    background: '#ffd43b',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span role="img" aria-label="profile" style={{marginRight: '0.5rem'}}>👤</span>Profile
                  </Link>
                  <button className="btn btn-danger mx-1" onClick={handleLogout} style={{
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.3s ease',
                    background: '#ff6b6b',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span role="img" aria-label="logout" style={{marginRight: '0.5rem'}}>🚪</span>Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
