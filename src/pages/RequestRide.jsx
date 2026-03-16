import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { requestRide } from "../redux/rideSlice";
import "./RequestRide.css";

function RequestRide() {
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [notes, setNotes] = useState("");

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

    function handleSubmit(e) {
        e.preventDefault();

        if (!pickup || !destination || !departureTime || !vehicleType) {
            alert("Please fill all required fields");
            return;
        }

        const newRequest = {
            id: Date.now(),
            userId: currentUser.id,
            name: currentUser.username,
            phone: currentUser.phone,
            pickup,
            destination,
            departureTime,
            vehicleType,
            notes,
            status: "open"
        };

        dispatch(requestRide(newRequest));

        alert("Ride request submitted");

        setPickup("");
        setDestination("");
        setDepartureTime("");
        setVehicleType("");
        setNotes("");

        safeNavigate("/dashboard");
    }

    return (
        <div className="requestride-page">

            <div className="requestride-topbar">
                <div>
                    <h1>Request a Ride</h1>
                    <p className="requestride-subtitle">
                        Let drivers know where you need to go
                    </p>
                </div>

                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>


            <div className="requestride-card">

                <div className="requester-panel">

                    <div className="requester-avatar">
                        {currentUser?.username?.charAt(0).toUpperCase()}
                    </div>

                    <h3>{currentUser?.username}</h3>

                    <p className="requester-role">
                        Requesting Passenger
                    </p>

                    <a
                        className="requester-phone"
                        href={`tel:${currentUser?.phone}`}
                    >
                        {currentUser?.phone}
                    </a>

                </div>


                <form className="requestride-form" onSubmit={handleSubmit}>

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

                    <label>Preferred Departure Time</label>
                    <input
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
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
                        Submit Request
                    </button>

                </form>

            </div>
        </div>
    );
}

export default RequestRide;