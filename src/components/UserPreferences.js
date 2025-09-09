import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const UserPreferences = () => {
    const { authToken } = useAuth();
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    const countries = [
        { code: 'us', name: 'United States' },
        { code: 'in', name: 'India' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' },
        { code: 'fr', name: 'France' },
        { code: 'de', name: 'Germany' },
        { code: 'jp', name: 'Japan' },
        { code: 'cn', name: 'China' },
        { code: 'br', name: 'Brazil' }
    ];


    const fetchPreferences = useCallback(async () => {
        try {
            const token = localStorage.getItem('token') || authToken;
            
            // Default preferences
            const defaultPreferences = {
                preferredCategories: ['technology', 'business', 'general'],
                preferredCountry: 'in',
                language: 'en',
                notificationSettings: {
                    breakingNews: true,
                    dailyDigest: false,
                    categoryAlerts: true
                },
                readingPreferences: {
                    articlesPerPage: 10,
                    openInNewTab: true,
                    showImages: true
                }
            };
            
            if (!token || token === 'demo-token') {
                // Use default preferences for demo mode
                setPreferences(defaultPreferences);
                setLoading(false);
                return;
            }

            const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE}/api/preferences/get`, {
                headers: {
                    'auth-token': token
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Merge with defaults in case some fields are missing
                setPreferences({
                    ...defaultPreferences,
                    ...data,
                    notificationSettings: { ...defaultPreferences.notificationSettings, ...data.notificationSettings },
                    readingPreferences: { ...defaultPreferences.readingPreferences, ...data.readingPreferences }
                });
            } else {
                console.error('Failed to fetch preferences, using defaults');
                setPreferences(defaultPreferences);
            }
        } catch (error) {
            console.error('Error fetching preferences, using defaults:', error);
            // Use default preferences on error
            setPreferences({
                preferredCategories: ['technology', 'business', 'general'],
                preferredCountry: 'in',
                language: 'en',
                notificationSettings: {
                    breakingNews: true,
                    dailyDigest: false,
                    categoryAlerts: true
                },
                readingPreferences: {
                    articlesPerPage: 10,
                    openInNewTab: true,
                    showImages: true
                }
            });
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const handleSave = async () => {
        if (!preferences) return;

        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token') || authToken;
            
            const response = await fetch('/api/preferences/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(preferences)
            });

            if (response.ok) {
                setMessage('Preferences saved successfully!');
            } else {
                const errorData = await response.text();
                console.error('Save error:', errorData);
                setMessage('Error saving preferences');
            }
        } catch (error) {
            setMessage('Error saving preferences');
            console.error('Error saving preferences:', error);
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleCategoryToggle = (category) => {
        const updatedCategories = preferences.preferredCategories.includes(category)
            ? preferences.preferredCategories.filter(c => c !== category)
            : [...preferences.preferredCategories, category];

        setPreferences({
            ...preferences,
            preferredCategories: updatedCategories
        });
    };

    const handleNotificationChange = (setting, value) => {
        setPreferences({
            ...preferences,
            notificationSettings: {
                ...preferences.notificationSettings,
                [setting]: value
            }
        });
    };

    const handleReadingPreferenceChange = (setting, value) => {
        setPreferences({
            ...preferences,
            readingPreferences: {
                ...preferences.readingPreferences,
                [setting]: value
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="container mt-5 pt-5">
                <div className="alert alert-danger">Failed to load preferences</div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4" style={{ marginTop: '80px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title mb-0">
                                <i className="fas fa-cog me-2"></i>User Preferences
                            </h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Preferred Categories */}
                            <div className="mb-4">
                                <h5 className="text-primary">
                                    <i className="fas fa-list me-2"></i>Preferred News Categories
                                </h5>
                                <div className="row">
                                    {categories.map(category => (
                                        <div key={category} className="col-md-6 col-lg-4 mb-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`category-${category}`}
                                                    checked={preferences.preferredCategories.includes(category)}
                                                    onChange={() => handleCategoryToggle(category)}
                                                />
                                                <label className="form-check-label text-capitalize" htmlFor={`category-${category}`}>
                                                    {category}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preferred Country */}
                            <div className="mb-4">
                                <h5 className="text-primary">
                                    <i className="fas fa-globe me-2"></i>Preferred Country
                                </h5>
                                <select
                                    className="form-select"
                                    value={preferences.preferredCountry}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        preferredCountry: e.target.value
                                    })}
                                >
                                    {countries.map(country => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Notification Settings */}
                            <div className="mb-4">
                                <h5 className="text-primary">
                                    <i className="fas fa-bell me-2"></i>Notification Settings
                                </h5>
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="breakingNews"
                                        checked={preferences.notificationSettings.breakingNews}
                                        onChange={(e) => handleNotificationChange('breakingNews', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="breakingNews">
                                        Breaking News Alerts
                                    </label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="dailyDigest"
                                        checked={preferences.notificationSettings.dailyDigest}
                                        onChange={(e) => handleNotificationChange('dailyDigest', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="dailyDigest">
                                        Daily News Digest
                                    </label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="weeklySummary"
                                        checked={preferences.notificationSettings.weeklySummary}
                                        onChange={(e) => handleNotificationChange('weeklySummary', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="weeklySummary">
                                        Weekly News Summary
                                    </label>
                                </div>
                            </div>

                            {/* Reading Preferences */}
                            <div className="mb-4">
                                <h5 className="text-primary">
                                    <i className="fas fa-book-reader me-2"></i>Reading Preferences
                                </h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="articlesPerPage" className="form-label">
                                            Articles per page
                                        </label>
                                        <select
                                            id="articlesPerPage"
                                            className="form-select"
                                            value={preferences.readingPreferences.articlesPerPage}
                                            onChange={(e) => handleReadingPreferenceChange('articlesPerPage', parseInt(e.target.value))}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="refreshInterval" className="form-label">
                                            Auto-refresh interval (minutes)
                                        </label>
                                        <select
                                            id="refreshInterval"
                                            className="form-select"
                                            value={preferences.readingPreferences.refreshInterval / 60}
                                            onChange={(e) => handleReadingPreferenceChange('refreshInterval', parseInt(e.target.value) * 60)}
                                        >
                                            <option value={1}>1 minute</option>
                                            <option value={5}>5 minutes</option>
                                            <option value={10}>10 minutes</option>
                                            <option value={15}>15 minutes</option>
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>1 hour</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="autoRefresh"
                                        checked={preferences.readingPreferences.autoRefresh}
                                        onChange={(e) => handleReadingPreferenceChange('autoRefresh', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="autoRefresh">
                                        Enable auto-refresh
                                    </label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="darkMode"
                                        checked={preferences.readingPreferences.darkMode}
                                        onChange={(e) => handleReadingPreferenceChange('darkMode', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="darkMode">
                                        Dark mode (coming soon)
                                    </label>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Save Preferences
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPreferences;
