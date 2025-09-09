import React from "react";
import ContactForm from './ContactForm';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-hero animate-fade-in-down">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title text-gradient">Contact NewsBoard</h1>
            <p className="hero-subtitle">
              We'd love to hear from you! Get in touch with our team for support, feedback, or any questions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="contact-content">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-8">
              <ContactForm />
            </div>
            
            <div className="col-lg-4">
              <div className="contact-info-sidebar animate-fade-in-right animate-delay-3">
                <div className="contact-card">
                  <h3 className="contact-card-title">
                    <i className="fas fa-headset"></i>
                    Get Support
                  </h3>
                  <p className="contact-card-text">
                    Our support team is here to help you with any technical issues or questions about NewsBoard.
                  </p>
                  <div className="contact-methods">
                    <div className="contact-method">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <strong>Email Support</strong>
                        <p>support@newsboard.com</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <i className="fas fa-phone"></i>
                      <div>
                        <strong>Phone Support</strong>
                        <p>+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <i className="fas fa-clock"></i>
                      <div>
                        <strong>Business Hours</strong>
                        <p>Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="contact-card">
                  <h3 className="contact-card-title">
                    <i className="fas fa-map-marker-alt"></i>
                    Our Location
                  </h3>
                  <p className="contact-card-text">
                    NewsBoard Headquarters<br/>
                    Tech Hub, Innovation District<br/>
                    Mumbai, India 400001
                  </p>
                </div>
                
                <div className="contact-card">
                  <h3 className="contact-card-title">
                    <i className="fas fa-rocket"></i>
                    Quick Links
                  </h3>
                  <div className="quick-links">
                    <a href="/about" className="quick-link">
                      <i className="fas fa-info-circle"></i>
                      About NewsBoard
                    </a>
                    <a href="/trending" className="quick-link">
                      <i className="fas fa-fire"></i>
                      Trending Topics
                    </a>
                    <a href="/dashboard" className="quick-link">
                      <i className="fas fa-chart-bar"></i>
                      Your Dashboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="contact-footer animate-fade-in-up animate-delay-4">
        <div className="container">
          <div className="footer-content">
            <h4>Follow Us</h4>
            <div className="social-links">
              <button className="social-link hover-glow" aria-label="Follow us on Twitter" onClick={() => window.open('https://twitter.com/newsboard', '_blank')}>
                <i className="fab fa-twitter"></i>
              </button>
              <button className="social-link hover-glow" aria-label="Follow us on Facebook" onClick={() => window.open('https://facebook.com/newsboard', '_blank')}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="social-link hover-glow" aria-label="Follow us on Instagram" onClick={() => window.open('https://instagram.com/newsboard', '_blank')}>
                <i className="fab fa-instagram"></i>
              </button>
              <button className="social-link hover-glow" aria-label="Follow us on LinkedIn" onClick={() => window.open('https://linkedin.com/company/newsboard', '_blank')}>
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
            <p className="footer-text">
              Stay connected with NewsBoard for the latest updates and news from around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
