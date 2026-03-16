import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./RideDetails.css";

function RideDetails() {
    const currentUser = useSelector(state => state.user.currentUser);
    const rides = useSelector(state => state.ride.rides);
    const requests = useSelector(state => state.ride.requests);

    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
        }
    }, [currentUser, navigate]);

    function safeNavigate(path) {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }
        navigate(path);
    }
    const isRequestPage = location.pathname.startsWith("/requests");

    const ride = rides.find(r => r.id === Number(id));
    const request = requests.find(r => r.id === Number(id));

    const item = isRequestPage ? request : ride;

    if (!item) {
        return (
            <div className="ride-details-container">
                <h2>Item not found</h2>
                <button onClick={() => safeNavigate("/rides")}>Back</button>
            </div>
        );
    }

    return (
        <div className="ride-details-container">
            <h1>{isRequestPage ? "Ride Request Details" : "Ride Details"}</h1>

            <div className="ride-details-card">
                <h2>{item.pickup} to {item.destination}</h2>

                {isRequestPage ? (
                    <>
                        <p><strong>Requested By:</strong> {item.name}</p>
                        <p><strong>Phone:</strong> {item.phone}</p>
                        <p><strong>Preferred Time:</strong> {item.departureTime}</p>
                        <p><strong>Vehicle:</strong> {item.vehicleType}</p>
                        <p><strong>Notes:</strong> {item.notes || "No notes"}</p>
                    </>
                ) : (
                    <>
                        <p><strong>Driver:</strong> {item.driverName}</p>
                        <p><strong>Departure Time:</strong> {item.departureTime}</p>
                        <p><strong>Available Seats:</strong> {item.availableSeats}</p>
                        <p><strong>Vehicle:</strong> {item.vehicleType}</p>
                        <p><strong>Contact:</strong> {item.contactInfo}</p>
                        <p><strong>Notes:</strong> {item.notes || "No notes"}</p>
                    </>
                )}
                <div className="ride-details-buttons">
                    <button onClick={() => safeNavigate("/rides")}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RideDetails;