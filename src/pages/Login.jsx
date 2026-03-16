import { useState } from 'react';
import loginCover from '../assets/login_cover.png';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const foundUser = users.find(
            (user) => user.username === username && user.password === password
        );

        if (foundUser) {
            dispatch(loginUser(foundUser));
            navigate("/dashboard");
        } else {
            alert("Invalid username or password");
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
                    <p className="login-subtitle">
                        Login to manage your rides, requests, and bookings
                    </p>

                    <div className="login-form-box">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button type="submit">Login</button>

                            <p className="login-register-text">
                                Don't have an account? <Link to="/register">Register</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;