import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Rides.css";

function Rides() {
    const currentUser = useSelector(state => state.user.currentUser);
    const rides = useSelector(state => state.ride.rides);
    const requests = useSelector(state => state.ride.requests);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState(searchParams.get("view") || "rides");

    const pickupFilter = searchParams.get("pickup") || "";
    const destinationFilter = searchParams.get("destination") || "";
    const vehicleFilter = searchParams.get("vehicle") || "";
    const timeFilter = searchParams.get("time") || "";

    const [pickup, setPickup] = useState(pickupFilter);
    const [destination, setDestination] = useState(destinationFilter);
    const [vehicle, setVehicle] = useState(vehicleFilter);
    const [time, setTime] = useState(timeFilter);

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
    function handleViewChange(mode) {
        setViewMode(mode);

        const params = {};
        params.view = mode;

        if (pickup.trim() !== "") {
            params.pickup = pickup;
        }
        if (destination.trim() !== "") {
            params.destination = destination;
        }
        if (vehicle.trim() !== "") {
            params.vehicle = vehicle;
        }
        if (time.trim() !== "") {
            params.time = time;
        }

        setSearchParams(params);
    }

    function handleFilter() {
        const params = {};
        params.view = viewMode;

        if (pickup.trim() !== "") {
            params.pickup = pickup;
        }
        if (destination.trim() !== "") {
            params.destination = destination;
        }
        if (vehicle.trim() !== "") {
            params.vehicle = vehicle;
        }
        if (time.trim() !== "") {
            params.time = time;
        }

        setSearchParams(params);
    }

    function clearFilters() {
        setPickup("");
        setDestination("");
        setVehicle("");
        setTime("");
        setSearchParams({ view: viewMode });
    }

    function convertToMinutes(timeString) {
        if (!timeString) return null;

        let time = timeString.trim().toLowerCase();
        time = time.replace(/\s+/g, "");

        const isAM = time.includes("am");
        const isPM = time.includes("pm");

        time = time.replace("am", "").replace("pm", "");

        const parts = time.split(":");
        if (parts.length !== 2) return null;

        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);

        if (isNaN(hours) || isNaN(minutes)) {
            return null;
        }

        if (isAM || isPM) {
            if (hours === 12 && isAM) {
                hours = 0;
            } else if (hours !== 12 && isPM) {
                hours = hours + 12;
            }
        }

        return hours * 60 + minutes;
    }

    function timeWithinOneHour(itemTime, filterTime) {
        if (filterTime === "") return true;

        const itemMinutes = convertToMinutes(itemTime);
        const filterMinutes = convertToMinutes(filterTime);

        if (itemMinutes === null || filterMinutes === null) return false;

        return Math.abs(itemMinutes - filterMinutes) <= 60;
    }

    function isRideMatch(ride) {
        const pickupMatch =
            pickupFilter === "" ||
            ride.pickup.toLowerCase().includes(pickupFilter.toLowerCase());

        const destinationMatch =
            destinationFilter === "" ||
            ride.destination.toLowerCase().includes(destinationFilter.toLowerCase());

        const vehicleMatch =
            vehicleFilter === "" ||
            ride.vehicleType.toLowerCase().includes(vehicleFilter.toLowerCase());

        const timeMatch = timeWithinOneHour(ride.departureTime, timeFilter);

        return pickupMatch && destinationMatch && vehicleMatch && timeMatch;
    }

    function isRequestMatch(request) {
        const pickupMatch =
            pickupFilter === "" ||
            request.pickup.toLowerCase().includes(pickupFilter.toLowerCase());

        const destinationMatch =
            destinationFilter === "" ||
            request.destination.toLowerCase().includes(destinationFilter.toLowerCase());

        const vehicleMatch =
            vehicleFilter === "" ||
            request.vehicleType.toLowerCase().includes(vehicleFilter.toLowerCase());

        const timeMatch = timeWithinOneHour(request.departureTime, timeFilter);

        return pickupMatch && destinationMatch && vehicleMatch && timeMatch;
    }

    const matchingRides = rides.filter(isRideMatch);
    const nonMatchingRides = rides.filter(ride => !isRideMatch(ride));
    const sortedRides = [...matchingRides, ...nonMatchingRides];

    const matchingRequests = requests.filter(isRequestMatch);
    const nonMatchingRequests = requests.filter(request => !isRequestMatch(request));
    const sortedRequests = [...matchingRequests, ...nonMatchingRequests];

    return (
        <div className="rides-container">
            <div className="rides-header">
                <h1>Campus Ride Board</h1>
                <button onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? "Hide Filters" : "Filter"}
                </button>
            </div>

            <div className="view-toggle">
                <button
                    className={viewMode === "rides" ? "active-toggle" : ""}
                    onClick={() => handleViewChange("rides")}
                >
                    View Rides
                </button>

                <button
                    className={viewMode === "requests" ? "active-toggle" : ""}
                    onClick={() => handleViewChange("requests")}
                >
                    View Requests
                </button>
            </div>

            {showFilters && (
                <div className="filter-box">
                    <input
                        type="text"
                        placeholder="Pickup"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />

                    <select
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                    >
                        <option value="">All Vehicles</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                    </select>

                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />

                    <button onClick={handleFilter}>Apply Filters</button>
                    <button onClick={clearFilters}>Clear</button>
                </div>
            )}

            {viewMode === "rides" ? (
                rides.length === 0 ? (
                    <p>No rides available right now.</p>
                ) : (
                    <div className="rides-list">
                        {sortedRides.map((ride) => {
                            const matched = isRideMatch(ride);

                            return (
                                <div
                                    className={`ride-card ${matched ? "matched-ride" : "faded-ride"}`}
                                    key={ride.id}
                                >
                                    <h2>{ride.pickup} to {ride.destination}</h2>
                                    <p><strong>Driver:</strong> {ride.driverName}</p>
                                    <p><strong>Departure Time:</strong> {ride.departureTime}</p>
                                    <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
                                    <p><strong>Vehicle:</strong> {ride.vehicleType}</p>

                                    <button onClick={() => safeNavigate(`/rides/${ride.id}`)}>
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                requests.length === 0 ? (
                    <p>No ride requests available right now.</p>
                ) : (
                    <div className="rides-list">
                        {sortedRequests.map((request) => {
                            const matched = isRequestMatch(request);

                            return (
                                <div
                                    className={`ride-card ${matched ? "matched-ride" : "faded-ride"}`}
                                    key={request.id}
                                >
                                    <h2>{request.pickup} to {request.destination}</h2>
                                    <p><strong>Requested By:</strong> {request.name}</p>
                                    <p><strong>Preferred Time:</strong> {request.departureTime}</p>
                                    <p><strong>Vehicle:</strong> {request.vehicleType}</p>
                                    
                                    <button onClick={() => safeNavigate(`/requests/${request.id}`)}>
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}

export default Rides;