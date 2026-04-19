import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { bookRide, bookRequest } from "../redux/rideSlice";
import { rideAPI, requestAPI } from "../api";
import "./RideDetails.css";

function RideDetails() {
    const currentUser = useSelector(state => state.user.currentUser);
    const rides = useSelector(state => state.ride.rides);
    const requests = useSelector(state => state.ride.requests);
    const bookings = useSelector(state => state.ride.bookings);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(false);

    function safeNavigate(path) {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }
        navigate(path);
    }

    const isRequestPage = location.pathname.startsWith("/requests");

    const ride = rides.find(r => r.id === Number(id) || r.id === id);
    const request = requests.find(r => r.id === Number(id) || r.id === id);
    const item = isRequestPage ? request : ride;

    if (!item) {
        return (
            <div className="ride-details-page">
                <div className="details-topbar">
                    <div>
                        <h1>Details</h1>
                        <p className="details-subtitle">Campus Ride Sharing Board</p>
                    </div>
                    <button onClick={() => navigate("/rides")}>Back</button>
                </div>

                <div className="ride-details-card">
                    <h2>Item not found</h2>
                </div>
            </div>
        );
    }

    const alreadyBookedRide = bookings.find(booking => booking.type === "ride" && booking.rideId === item.id && booking.userId === currentUser?.id);
    const alreadyBookedRequest = bookings.find(booking => booking.type === "request" && booking.requestId === item.id && booking.userId === currentUser?.id);

    async function handleBookRide() {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }
        if (item.createdBy === currentUser.id || item.createdBy?._id === currentUser.id) {
            alert("You cannot book your own ride");
            return;
        }
        if (item.availableSeats <= 0) {
            alert("No seats available");
            return;
        }
        if (alreadyBookedRide) {
            alert("You have already booked this ride");
            return;
        }

        setLoading(true);
        try {
            const rideId = typeof item.id === 'string' ? item.id : item.id;
            const response = await rideAPI.bookRide(rideId);

            if (!response.booking) {
                alert(response.message || "Failed to book ride");
                setLoading(false);
                return;
            }

            dispatch(bookRide({
                rideId: item.id,
                userId: currentUser.id
            }));

            alert("Ride booked successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error booking ride: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleBookRequest() {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }
        if (item.userId === currentUser.id || item.userId?._id === currentUser.id) {
            alert("You cannot respond to your own request");
            return;
        }
        if (item.status === "fulfilled") {
            alert("This request has already been fulfilled");
            return;
        }
        if (alreadyBookedRequest) {
            alert("You have already responded to this request");
            return;
        }

        setLoading(true);
        try {
            const requestId = typeof item.id === 'string' ? item.id : item.id;
            const response = await requestAPI.fulfillRequest(requestId);

            if (!response.booking) {
                alert(response.message || "Failed to fulfill request");
                setLoading(false);
                return;
            }

            dispatch(bookRequest({
                requestId: item.id,
                userId: currentUser.id
            }));

            alert("Request accepted successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error fulfilling request: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ride-details-page">
            <div className="details-topbar">
                <div>
                    <h1>{isRequestPage ? "Ride Request Details" : "Ride Details"}</h1>
                    <p className="details-subtitle">{isRequestPage ? "Review request information before responding" : "Review ride information before booking"}</p>
                </div>
                <button onClick={() => safeNavigate("/rides")}>Back</button>
            </div>

            <div className="ride-details-card">
                <div className="details-main">

                    <div className="profile-panel">
                        <div className="profile-avatar">
                            {isRequestPage ? (item.name ? item.name.charAt(0).toUpperCase() : "U") : (item.driverName ? item.driverName.charAt(0).toUpperCase() : "U")}
                        </div>

                        <h3>{isRequestPage ? item.name : item.driverName}</h3>

                        <p className="profile-role">{isRequestPage ? "Requester" : "Driver"}</p>

                        <a className="phone-link" href={`tel:${isRequestPage ? item.phone : item.contactInfo}`} >{isRequestPage ? item.phone : item.contactInfo}</a>
                    </div>

                    <div className="details-content">
                        <div className="route-box">
                            <h2>{item.pickup} to {item.destination}</h2>
                        </div>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">{item.departureTime}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Vehicle</span>
                                <span className="detail-value">{item.vehicleType}</span>
                            </div>

                            {isRequestPage ? (
                                <div className="detail-item">
                                    <span className="detail-label">Status</span>
                                    <span className={`status-badge ${(item.status || "open") === "fulfilled" ? "fulfilled" : "open"}`}>{item.status || "open"}</span>
                                </div>
                            ) : (
                                <div className="detail-item">
                                    <span className="detail-label">Available Seats</span>
                                    <span className="detail-value">{item.availableSeats}</span>
                                </div>
                            )}
                        </div>

                        <div className="notes-box">
                            <h3>Notes</h3>
                            <p>{item.notes || "No notes added."}</p>
                        </div>
                    </div>
                </div>

                <div className="ride-details-buttons">
                    <button onClick={() => navigate("/rides")}>Back</button>

                    {isRequestPage ? (
                        <button onClick={handleBookRequest} disabled={loading || item.userId === currentUser?.id || item.userId?._id === currentUser?.id || item.status === "fulfilled" || alreadyBookedRequest} >
                            {loading ? "Accepting..." : (item.status === "fulfilled" ? "Request Fulfilled" : "Respond to Request")}
                        </button>
                    ) : (
                        <button onClick={handleBookRide} disabled={loading || item.createdBy === currentUser?.id || item.createdBy?._id === currentUser?.id || item.availableSeats <= 0 || alreadyBookedRide} >
                            {loading ? "Booking..." : (item.availableSeats <= 0 ? "Ride Full" : "Book Ride")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RideDetails;