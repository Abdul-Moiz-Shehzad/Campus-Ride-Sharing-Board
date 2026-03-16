import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRide } from "../redux/rideSlice";
import { logoutUser } from "../redux/userSlice";
import "./NewRide.css";

function NewRide() {
    const currentUser = useSelector(state => state.user.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!currentUser && !isLoggingOut) {
            alert("Please Login First");
            navigate("/login");
        }
    }, [currentUser, isLoggingOut, navigate]);

    function logout() {
        setIsLoggingOut(true);
        dispatch(logoutUser());
        alert("Logged out successfully");
        navigate("/login");
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!pickup || !destination || !departureTime || !availableSeats || !vehicleType) {
            alert("Please fill all required fields");
            return;
        }

        const newRide = {
            id: Date.now(),
            driverName: currentUser.username,
            createdBy: currentUser.id,
            pickup,
            destination,
            departureTime,
            availableSeats: Number(availableSeats),
            vehicleType,
            contactInfo: currentUser.phone,
            notes
        };

        dispatch(addRide(newRide));

        alert("Ride posted successfully");

        setPickup("");
        setDestination("");
        setDepartureTime("");
        setAvailableSeats("");
        setVehicleType("");
        setNotes("");

        navigate("/rides");
    }

    return (
        <div className="newride-page">

            <div className="newride-topbar">
                <div>
                    <h1>Post a New Ride</h1>
                    <p className="newride-subtitle">
                        Share your ride with other students
                    </p>
                </div>

                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>


            <div className="newride-card">

                <div className="driver-panel">
                    <div className="driver-avatar">
                        {currentUser?.username?.charAt(0).toUpperCase()}
                    </div>

                    <h3>{currentUser?.username}</h3>

                    <p className="driver-role">Driver</p>

                    <a
                        className="driver-phone"
                        href={`tel:${currentUser?.phone}`}
                    >
                        {currentUser?.phone}
                    </a>
                </div>


                <form className="newride-form" onSubmit={handleSubmit}>

                    <label>Pickup Location</label>
                    <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                    />

                    <label>Destination</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />

                    <label>Departure Time</label>
                    <input
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                    />

                    <label>Available Seats</label>
                    <input
                        type="number"
                        min="1"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                    />

                    <label>Vehicle Type</label>
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                    >
                        <option value="">Select Vehicle</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                    </select>

                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <button type="submit">
                        Post Ride
                    </button>

                </form>

            </div>
        </div>
    );
}

export default NewRide;