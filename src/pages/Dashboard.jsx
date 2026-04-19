import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { logoutUser } from "../redux/userSlice";
import { removeToken } from "../api";

function Dashboard() {
    const currentUser = useSelector(state => state.user.currentUser);
    const users = useSelector(state => state.user.users);
    const rides = useSelector(state => state.ride.rides);
    const bookings = useSelector(state => state.ride.bookings);
    const requests = useSelector(state => state.ride.requests);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!currentUser && !isLoggingOut) {
            alert("Please Login First");
            navigate("/login");
        }
    }, [currentUser, isLoggingOut, navigate]);

    function safeNavigate(path) {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }
        navigate(path);
    }

    function logout() {
        setIsLoggingOut(true);
        removeToken();
        dispatch(logoutUser());
        alert("Logged out successfully");
        navigate("/login");
    }

    const myBookings = bookings.filter(booking => booking.userId === currentUser?.id);
    const myPostedRides = rides.filter(ride => ride.createdBy === currentUser?.id);
    const myRequests = requests.filter(request => request.userId === currentUser?.id);

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div>
                    <h1>Dashboard</h1>
                    <p className="topbar-subtitle">Campus Ride Sharing Board</p>
                </div>
                <button className="logout-button" onClick={logout}>Logout</button>
            </div>

            <div className="dashboard-hero-banner">
                <div className="dashboard-hero-text">
                    <h2>Welcome back, {currentUser ? currentUser.username : "Guest"}!</h2>
                    <p>Manage your rides, track requests, and keep up with your bookingsfrom one place.</p>
                </div>
                <div className="dashboard-hero-badge">
                    <span>Active User</span>
                </div>
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
                <button onClick={() => safeNavigate("/rides")}>View All Rides</button>
                <button onClick={() => safeNavigate("/newride")}>Post New Ride</button>
                <button onClick={() => safeNavigate("/requestride")}>Request Ride</button>
                <button onClick={() => safeNavigate("/profile")}>My Profile</button>
            </div>

            <div className="dashboard-sections">
                <div className="dashboard-card">
                    <h2>My Bookings</h2>
                    {myBookings.length > 0 ? (
                        <ul>
                            {myBookings.slice(0, 3).map(booking => {
                                const ride = rides.find(r => r.id === booking.rideId);

                                if (!ride) {
                                    return null;
                                }

                                return (
                                    <li key={booking.id} className="info-item">
                                        <strong>{ride.pickup} to {ride.destination}</strong><br/>
                                        Driver: {ride.driverName}<br/>
                                        Phone: <a href={`tel:${ride.contactInfo}`}>{ride.contactInfo}</a><br/>
                                        Time: {ride.departureTime}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No bookings yet.</p>
                    )}
                </div>

                <div className="dashboard-card">
                    <h2>My Posted Rides</h2>
                    {myPostedRides.length > 0 ? (
                        myPostedRides.slice(0, 3).map(ride => {
                            const passengers = bookings.filter(b => b.rideId === ride.id);

                            return (
                                <div key={ride.id} className="ride-summary">
                                    <strong>{ride.pickup} to {ride.destination}</strong><br />
                                    Seats Left: {ride.availableSeats}

                                    {passengers.length > 0 && (
                                        <ul>
                                            {passengers.map(p => {
                                                const user = users.find(u => u.id === p.userId);

                                                return (
                                                    <li key={p.id} className="info-item">
                                                        Passenger: {user?.username}<br/>
                                                        Phone: <a href={`tel:${user?.phone}`}>{user?.phone}</a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No rides posted yet.</p>
                    )}
                </div>

                <div className="dashboard-card">
                    <h2>My Requests</h2>
                    {myRequests.length > 0 ? (
                        myRequests.slice(0,3).map(request => {
                            const accepted = bookings.find(b => b.requestId === request.id);
                            const driver = users.find(u => u.id === accepted?.userId);
                            return (
                                <div key={request.id} className="ride-summary">
                                    <strong>{request.pickup} to {request.destination}</strong><br/>
                                    {accepted ? (
                                        <div>
                                            <div className="status accepted">Status: Accepted<br/></div>
                                            Driver: {driver?.username}<br/>
                                            Phone: <a href={`tel:${driver?.phone}`}>{driver?.phone}</a>
                                        </div>
                                    ) : (
                                        <div className="status pending">Status: Waiting for driver</div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <p>No ride requests yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;