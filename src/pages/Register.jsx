import loginCover from '../assets/login_cover.png';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/userSlice';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.user.users);

    function handleSubmit(e) {
        e.preventDefault();

        if (!username || !phone || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        const usernameExists = users.find(
            user => user.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            alert("This username is already taken");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            password,
            phone
        };

        dispatch(registerUser(newUser));

        setUsername("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        alert("Registration successful! Please login.");
        navigate("/login");
    }

    return (
        <div className="register-page">
            <div className="register-left-section">
                <img src={loginCover} alt="register" />
            </div>

            <div className="register-right-section">
                <div className="register-content">
                    <h1>Create Account</h1>
                    <p className="register-subtitle">
                        Join CampusRide and start sharing or requesting rides
                    </p>

                    <div className="register-form-box">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <button type="submit">Register</button>

                            <p className="register-login-text">
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;