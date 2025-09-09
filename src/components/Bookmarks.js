import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const Bookmarks = () => {
    const { authToken } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        category: 'all',
        readStatus: 'all',
        sortBy: 'bookmarkedAt',
        sortOrder: 'desc'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalBookmarks: 0
    });
    const [stats, setStats] = useState(null);

    const categories = ['all', 'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    const readStatuses = ['all', 'unread', 'reading', 'completed'];



    const fetchBookmarks = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pagination.currentPage.toString(),
                category: filter.category,
                readStatus: filter.readStatus,
                sortBy: filter.sortBy,
                sortOrder: filter.sortOrder
            });

            const response = await fetch(`/api/bookmarks/all?${queryParams}`, {
                headers: {
                    'auth-token': authToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBookmarks(data.bookmarks);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    }, [authToken, filter, pagination.currentPage]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/bookmarks/stats', {
                headers: {
                    'auth-token': authToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [authToken]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRemoveBookmark = async (bookmarkId) => {
        if (!window.confirm('Are you sure you want to remove this bookmark?')) {
            return;
        }

        try {
            const response = await fetch(`/api/bookmarks/remove/${bookmarkId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': authToken
                }
            });

            if (response.ok) {
                setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
                fetchStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    const handleUpdateReadStatus = async (bookmarkId, newStatus) => {
        try {
            const response = await fetch(`/api/bookmarks/update/${bookmarkId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                },
                body: JSON.stringify({ readStatus: newStatus })
            });

            if (response.ok) {
                const updatedBookmark = await response.json();
                setBookmarks(bookmarks.map(bookmark => 
                    bookmark._id === bookmarkId ? updatedBookmark : bookmark
                ));
                fetchStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Error updating read status:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatReadingTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    const getStatusBadge = (status) => {
        const badges = {
            'unread': 'bg-secondary',
            'reading': 'bg-warning',
            'completed': 'bg-success'
        };
        return badges[status] || 'bg-secondary';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            'low': 'bg-info',
            'medium': 'bg-primary',
            'high': 'bg-danger'
        };
        return badges[priority] || 'bg-primary';
    };

    return (
        <div className="container mt-5 pt-4" style={{ marginTop: '80px' }}>
            {/* Stats Cards */}
            {stats && (
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card text-center bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">{stats.totalBookmarks}</h5>
                                <p className="card-text">Total Bookmarks</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {stats.readStatusStats.find(s => s._id === 'completed')?.count || 0}
                                </h5>
                                <p className="card-text">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center bg-warning text-white">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {stats.readStatusStats.find(s => s._id === 'reading')?.count || 0}
                                </h5>
                                <p className="card-text">Reading</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center bg-secondary text-white">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {stats.readStatusStats.find(s => s._id === 'unread')?.count || 0}
                                </h5>
                                <p className="card-text">Unread</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header and Filters */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-bookmark me-2"></i>My Bookmarks
                </h2>
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-select"
                        value={filter.readStatus}
                        onChange={(e) => setFilter({ ...filter, readStatus: e.target.value })}
                    >
                        {readStatuses.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bookmarks List */}
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-bookmark fa-3x text-muted mb-3"></i>
                    <h4>No bookmarks found</h4>
                    <p className="text-muted">Start bookmarking articles to see them here!</p>
                </div>
            ) : (
                <>
                    <div className="row">
                        {bookmarks.map(bookmark => (
                            <div key={bookmark._id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    {bookmark.urlToImage && (
                                        <img
                                            src={bookmark.urlToImage}
                                            className="card-img-top"
                                            alt={bookmark.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-2">
                                            <span className={`badge ${getStatusBadge(bookmark.readStatus)} me-2`}>
                                                {bookmark.readStatus}
                                            </span>
                                            <span className={`badge ${getPriorityBadge(bookmark.priority)} me-2`}>
                                                {bookmark.priority}
                                            </span>
                                            <span className="badge bg-light text-dark">
                                                {bookmark.category}
                                            </span>
                                        </div>
                                        <h6 className="card-title">{bookmark.title}</h6>
                                        <p className="card-text text-muted small flex-grow-1">
                                            {bookmark.description}
                                        </p>
                                        <div className="text-muted small mb-3">
                                            <div>By {bookmark.author}</div>
                                            <div>Bookmarked: {formatDate(bookmark.bookmarkedAt)}</div>
                                            {bookmark.readingTime > 0 && (
                                                <div>Reading time: {formatReadingTime(bookmark.readingTime)}</div>
                                            )}
                                        </div>
                                        <div className="mt-auto">
                                            <div className="btn-group w-100 mb-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleUpdateReadStatus(bookmark._id, 'unread')}
                                                    disabled={bookmark.readStatus === 'unread'}
                                                >
                                                    Unread
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => handleUpdateReadStatus(bookmark._id, 'reading')}
                                                    disabled={bookmark.readStatus === 'reading'}
                                                >
                                                    Reading
                                                </button>
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => handleUpdateReadStatus(bookmark._id, 'completed')}
                                                    disabled={bookmark.readStatus === 'completed'}
                                                >
                                                    Done
                                                </button>
                                            </div>
                                            <div className="d-flex gap-1">
                                                <a
                                                    href={bookmark.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary btn-sm flex-grow-1"
                                                >
                                                    Read Article
                                                </a>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveBookmark(bookmark._id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                        disabled={!pagination.hasPrev}
                                    >
                                        Previous
                                    </button>
                                </li>
                                <li className="page-item active">
                                    <span className="page-link">
                                        {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                </li>
                                <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                        disabled={!pagination.hasNext}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
};

export default Bookmarks;
