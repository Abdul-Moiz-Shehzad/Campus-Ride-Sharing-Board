import loginCover from '../assets/login_cover.png';
import { Link } from 'react-router-dom';
import './Register.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Register(){
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [phone, setPhone] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        console.log(username, password);
        if (!username || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const newUser = {
            id: Date.now(),
            username: username,
            password: password,
            phone: phone,
        };
        dispatch(registerUser(newUser));
        console.log("User registered:", newUser);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        alert("Registration successful! Please login.");
        navigate("/login");
    }



    return(
        <div className="register-container">
            <div className="register-left-section">
                <img src={loginCover} alt="login"/>
            </div>
            <div className="register-right-section">
            <h1>Register</h1>
                <div className="register-form-box">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                        
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                        
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                        
                        <button type="submit">Register</button>
                        <h6>Already have an account? <Link to="/login">Login</Link></h6>
                    </form>
                </div>

            </div>

        </div>
    );
}
export default Register;