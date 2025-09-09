import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileManagement.css';

const ProfileManagement = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    profilePicture: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        profilePicture: user.profilePicture || null
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'File size must be less than 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (profileData.website && !profileData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must start with http:// or https://';
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      if (updateProfile) {
        await updateProfile(profileData);
      }
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call - replace with actual password change endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoRemove = () => {
    setProfileData(prev => ({ ...prev, profilePicture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="alert alert-warning">
          Please log in to access your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
        </div>
      )}

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Information
        </button>
        <button 
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          🔒 Change Password
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <form onSubmit={handleProfileSubmit}>
              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              {/* Profile Picture Section */}
              <div className="profile-picture-section">
                <h3>Profile Picture</h3>
                <div className="picture-upload-area">
                  <div className="current-picture">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="profile-pic"
                      />
                    ) : (
                      <div className="profile-pic-placeholder">
                        {getInitials(profileData.name || user?.name || 'User')}
                      </div>
                    )}
                  </div>
                  <div className="picture-controls">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="file-input"
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📷 Change Photo
                    </button>
                    {profileData.profilePicture && (
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm"
                        onClick={handlePhotoRemove}
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                </div>
                {errors.profilePicture && (
                  <div className="error-message">{errors.profilePicture}</div>
                )}
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      className="form-control"
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      className={`form-control ${errors.website ? 'error' : ''}`}
                      placeholder="https://your-website.com"
                    />
                    {errors.website && <div className="error-message">{errors.website}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="form-control"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                  <small className="form-text">
                    {profileData.bio.length}/500 characters
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="password-tab">
            <form onSubmit={handlePasswordSubmit}>
              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              <div className="form-section">
                <h3>Change Password</h3>
                <p className="text-muted">Ensure your account is secure by using a strong password.</p>

                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`form-control ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="Enter your current password"
                  />
                  {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`form-control ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter your new password"
                  />
                  {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                  <small className="form-text">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your new password"
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Changing...
                    </>
                  ) : (
                    '🔒 Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
