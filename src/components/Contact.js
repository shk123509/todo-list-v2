import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="container" style={{ maxWidth: 500, margin: "80px auto", marginTop: "80px", background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(88,101,242,0.12)", padding: "2rem" }}>
      <h2 style={{ color: "#5865F2", fontWeight: "bold", marginBottom: 20 }}>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className="form-control" name="message" rows={4} value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100" style={{ background: "#5865F2", border: "none", borderRadius: 10, fontWeight: "bold" }}>Send Message</button>
      </form>
      {submitted && <div className="alert alert-success mt-3 text-center">Thank you for contacting us!</div>}
      <div style={{ marginTop: 30, color: "#23272A", fontSize: "0.95rem" }}>
        <strong>Email:</strong> support@newsboard.com<br />
        <strong>Phone:</strong> +91 98765 43210
      </div>
    </div>
  );
};

export default Contact;
