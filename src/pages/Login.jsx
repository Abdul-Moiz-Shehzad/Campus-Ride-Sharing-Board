import { useState } from 'react';
import loginCover from '../assets/login_cover.png';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import { userAPI, setToken } from '../api';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await userAPI.login(username, password);

            if (!response.token) {
                alert(response.message || "Invalid username or password");
                setLoading(false);
                return;
            }

            // Store token
            setToken(response.token);

            // Update Redux with user data
            dispatch(loginUser(response.user));

            navigate("/dashboard");
        } catch (error) {
            alert("Error logging in: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-left-section">
                <img src={loginCover} alt="login" />
            </div>

            <div className="login-right-section">
                <div className="login-content">
                    <h1>Welcome Back</h1>
                    <p className="login-subtitle">Login to manage your rides, requests, and bookings</p>

                    <div className="login-form-box">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            
                            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

                            <p className="login-register-text">Don't have an account? <Link to="/register">Register</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;