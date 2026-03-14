import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const rides = useSelector((state) => state.ride?.rides || []);
    const navigate = useNavigate();
    const bookings = useSelector((state) => state.ride?.bookings || []);
    const requests = useSelector((state) => state.ride?.requests || []);
    useEffect(() => {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
        }
    },[currentUser, navigate]);
    const myBookings = bookings.filter((booking) => booking.userId === currentUser?.id);
    const myPostedRides = rides.filter((ride) => ride.createdBy === currentUser?.id);
    const myRequests = requests.filter((request) => request.userId === currentUser?.id);
    
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="welcome-box">
                <h2>Welcome, {currentUser ? currentUser.username : "Guest"}</h2>
                <p>Manage your rides, bookings, and requests from here.</p>
            </div>

            <div className="stats-section">
                <div className="stat-card">
                    <h3>{myBookings.length}</h3>
                    <p>My Bookings</p>
                </div>
                <div className="stat-card">
                    <h3>{myPostedRides.length}</h3>
                    <p>My Posted Rides</p>
                </div>
                <div className="stat-card">
                    <h3>{myRequests.length}</h3>
                    <p>My Requests</p>
                </div>
            </div>

            <div className="quick-actions">
            <button onClick={() => navigate("/rides")}>View All Rides</button>
            <button onClick={() => navigate("/newride")}>Post New Ride</button>
            <button onClick={() => navigate("/requestride")}>Request Ride</button>
            <button onClick={() => navigate("/profile")}>My Profile</button>
            </div>

            <div className="dashboard-sections">
            <div className="dashboard-card">
                <h2>Recent Bookings</h2>
                {myBookings.length > 0 ? (
                <ul>
                    {myBookings.slice(0, 3).map((booking) => (
                    <li key={booking.id}>
                        Ride ID: {booking.rideId}
                    </li>
                    ))}
                </ul>
                ) : (
                <p>No bookings yet.</p>
                )}
            </div>

            <div className="dashboard-card">
                <h2>My Posted Rides</h2>
                {myPostedRides.length > 0 ? (
                <ul>
                    {myPostedRides.slice(0, 3).map((ride) => (
                    <li key={ride.id}>
                        {ride.pickup} to {ride.destination}
                    </li>
                    ))}
                </ul>
                ) : (
                <p>No rides posted yet.</p>
                )}
            </div>

            <div className="dashboard-card">
                <h2>Recent Requests</h2>
                {myRequests.length > 0 ? (
                <ul>
                    {myRequests.slice(0, 3).map((request) => (
                    <li key={request.id}>
                        {request.pickup} to {request.destination}
                    </li>
                    ))}
                </ul>
                ) : (
                <p>No ride requests yet.</p>
                )}
            </div>
            </div>
        </div>
    );
}

export default Dashboard;