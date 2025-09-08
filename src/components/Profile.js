import React, { useState } from "react";

function Profile({ user, onUpdateUser }) {
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const updatedUser = { ...user, name };
      onUpdateUser(updatedUser);
      setMessage("Profile updated successfully!");
  setTimeout(() => setMessage("") , 2000);
    }
  };

  return (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)', marginTop: '80px' }}>
      <div className="card shadow-lg p-4 fade-in" style={{ maxWidth: 400, width: '100%', borderRadius: 20 }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: 40, color: '#4e54c8' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path fillRule="evenodd" d="M8 9a5 5 0 0 0-5 5v.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14a5 5 0 0 0-5-5z"/>
              </svg>
            </span>
          </div>
          <h3 style={{ color: '#4e54c8', fontWeight: 'bold' }}>{user?.name || 'User'}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 'bold', color: '#4e54c8' }}>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderRadius: 10, border: '1px solid #8f94fb' }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: 10, fontWeight: 'bold', background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)', border: 'none' }}>Update</button>
        </form>
        {message && <div className="alert alert-success mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
}

export default Profile;
