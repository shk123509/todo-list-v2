import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({ type: 'success', message: result.message || 'Message sent successfully! We\'ll get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorMessage = result.message || result.errors?.[0]?.msg || 'Failed to send message. Please try again.';
        setSubmitStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container animate-fade-in-up">
      <div className="contact-form-wrapper">
        <div className="contact-form-header">
          <h3 className="contact-form-title text-gradient">
            <i className="fas fa-envelope"></i>
            Get in Touch
          </h3>
          <p className="contact-form-subtitle">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {submitStatus && (
          <div className={`alert animate-slide-in-down ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <i className={`fas ${submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group animate-fade-in-left animate-delay-1">
              <label htmlFor="name" className="form-label">
                <i className="fas fa-user"></i>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Your full name"
              />
            </div>

            <div className="form-group animate-fade-in-right animate-delay-2">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-group animate-fade-in-up animate-delay-3">
            <label htmlFor="subject" className="form-label">
              <i className="fas fa-tag"></i>
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="form-input form-select"
            >
              <option value="">Choose a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="bug-report">Bug Report</option>
              <option value="feature-request">Feature Request</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group animate-fade-in-up animate-delay-4">
            <label htmlFor="message" className="form-label">
              <i className="fas fa-comment-alt"></i>
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="6"
              className="form-input form-textarea"
              placeholder="Tell us how we can help you..."
            />
            <div className="character-count">
              {formData.message.length} / 1000 characters
            </div>
          </div>

          <div className="form-actions animate-fade-in-up animate-delay-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-btn btn-animated ${isSubmitting ? 'loading' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        <div className="contact-info animate-fade-in-up animate-delay-6">
          <div className="contact-info-item">
            <i className="fas fa-clock"></i>
            <span>Response time: Usually within 24 hours</span>
          </div>
          <div className="contact-info-item">
            <i className="fas fa-shield-alt"></i>
            <span>Your information is secure and private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
