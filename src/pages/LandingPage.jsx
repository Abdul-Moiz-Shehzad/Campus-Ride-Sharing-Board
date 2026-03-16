import { Link,useNavigate } from "react-router-dom";
import "./Landing.css";
import hero from "../assets/carpool.png";

function Landing() {
    const navigate = useNavigate();
    return (
        <div className="landing-page">

            <div className="landing-navbar">
                <h2>CampusRide</h2>

                <div className="nav-buttons">
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>


            <div className="hero-section">

                <div className="hero-text">
                    <h1>Find or Share Rides Across Campus</h1>

                    <p>
                        CampusRide helps students easily share rides, request
                        rides, and connect with others traveling the same route.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn" onClick={() => navigate("/register")}>Get Started</button>
                        <button className="secondary-btn" onClick={() => navigate("/login")}>Login</button>
                    </div>
                </div>


                <div className="hero-image">
                    <img src={hero} alt="Ride sharing illustration" />
                </div>

            </div>


            <div className="features-section">

                <h2>What You Can Do</h2>

                <div className="features-grid">

                    <div className="feature-card">
                        <h3>Post Rides</h3>
                        <p>
                            Drivers can post available rides with departure
                            time, vehicle type, and seats available.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Request Rides</h3>
                        <p>
                            Need a ride? Post your request and drivers can
                            respond to help you reach your destination.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Book Seats</h3>
                        <p>
                            Browse available rides and instantly book a seat
                            with the driver.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Connect with Students</h3>
                        <p>
                            See driver or passenger details and contact them
                            directly to coordinate your ride.
                        </p>
                    </div>

                </div>

            </div>


            <div className="cta-section">

                <h2>Start Sharing Rides Today</h2>

                <p>
                    Join other students using CampusRide to travel easily
                    around campus.
                </p>
                <button className="primary-btn" onClick={() => navigate("/register")}>Create Account</button>
            </div>


            <div className="landing-footer">
                <p>CampusRide • Student Ride Sharing Platform</p>
            </div>

        </div>
    );
}

export default Landing;