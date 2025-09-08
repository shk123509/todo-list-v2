import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container dashboard-bg">
      <header className="home-header fade-in" style={{background: 'linear-gradient(90deg, #5865F2 0%, #23272A 100%)', color: '#fff', borderRadius: '0 0 30px 30px'}}>
        <h1 className="logo" style={{fontSize: '2.8rem', fontWeight: 'bold', letterSpacing: '2px'}}>🗞️ NewsBoard</h1>
        <p className="tagline" style={{fontSize: '1.2rem', marginBottom: 30}}>Your dashboard for the latest headlines, updates, and more.</p>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'}}>
          <Link to="/NewsMonkey"><button className="get-started-btn dashboard-btn">Go to News</button></Link>
          <Link to="/profile"><button className="get-started-btn dashboard-btn">Profile</button></Link>
          <Link to="/contact"><button className="get-started-btn dashboard-btn">Contact</button></Link>
        </div>
      </header>

    <main className="main-content fade-in" style={{animationDelay: '0.3s', marginTop: '80px'}}>
        <section className="dashboard-widgets" style={{display: 'flex', gap: '2rem', justifyContent: 'center', margin: '40px 0', flexWrap: 'wrap'}}>
          <div className="widget-card" style={{background: '#5865F2', color: '#fff', borderRadius: 18, padding: '2rem 1.5rem', minWidth: 220, boxShadow: '0 2px 12px rgba(88,101,242,0.15)'}}>
            <span style={{fontSize: '2.2rem'}}>📰</span>
            <h3 style={{margin: '10px 0'}}>Latest News</h3>
            <p>Stay updated with trending stories.</p>
          </div>
          <div className="widget-card" style={{background: '#23272A', color: '#fff', borderRadius: 18, padding: '2rem 1.5rem', minWidth: 220, boxShadow: '0 2px 12px rgba(35,39,42,0.15)'}}>
            <span style={{fontSize: '2.2rem'}}>�</span>
            <h3 style={{margin: '10px 0'}}>Your Profile</h3>
            <p>Manage your account and preferences.</p>
          </div>
          <div className="widget-card" style={{background: '#57F287', color: '#23272A', borderRadius: 18, padding: '2rem 1.5rem', minWidth: 220, boxShadow: '0 2px 12px rgba(87,242,135,0.15)'}}>
            <span style={{fontSize: '2.2rem'}}>📞</span>
            <h3 style={{margin: '10px 0'}}>Contact Us</h3>
            <p>Reach out for support or feedback.</p>
          </div>
        </section>
      </main>

      <footer className="home-footer fade-in" style={{animationDelay: '1s', background: '#23272A', color: '#fff', borderRadius: '20px', margin: '30px 0 0 0'}}>
        &copy; {new Date().getFullYear()} NewsBoard — Built with ❤️ by You
      </footer>
    </div>
  );
}
