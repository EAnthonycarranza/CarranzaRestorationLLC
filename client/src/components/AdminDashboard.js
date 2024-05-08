import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLogin from './AdminLogin'; // Ensure this is the correct path

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    // Function to handle successful login
    const handleLoginSuccess = () => {
        setIsAdmin(true);
    };

    if (!isAdmin) {
        // Render the AdminLogin component if the user isn't logged in
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    // Render the dashboard once authenticated
    return (
        <div className="container-fluid py-6 px-5">
            <h2 className="text-center mb-5">Admin Dashboard</h2>
            <div className="row g-4 text-center">
                <div className="col-md-4">
                    <Link to="/AdminBlogNav" className="btn btn-primary btn-lg w-100">Manage Blog Posts</Link>
                </div>
                <div className="col-md-4">
                    <Link to="/Graph" className="btn btn-primary btn-lg w-100">View Analytics</Link>
                </div>
                <div className="col-md-4">
                    <Link to="/Travel" className="btn btn-primary btn-lg w-100">Travel Notification</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
