import loginCover from '../assets/login_cover.png';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/userSlice';
import { userAPI, setToken } from '../api';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (!username || !phone || !password || !confirmPassword) {
            alert("Please fill all fields");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await userAPI.register(username, password, confirmPassword, phone);

            if (!response.token) {
                alert(response.message || "Registration failed");
                setLoading(false);
                return;
            }

            // Store token
            setToken(response.token);

            // Update Redux with user data
            dispatch(registerUser(response.user));

            setUsername("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");

            alert("Registration successful! Logging you in.");
            navigate("/dashboard");
        } catch (error) {
            alert("Error registering: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-left-section">
                <img src={loginCover} alt="register" />
            </div>

            <div className="register-right-section">
                <div className="register-content">
                    <h1>Create Account</h1>
                    <p className="register-subtitle">Join CampusRide and start sharing or requesting rides</p>

                    <div className="register-form-box">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
                            <p className="register-login-text">Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;