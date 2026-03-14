import React from 'react';
import loginCover from '../assets/login_cover.png';
import { Link,useNavigate } from 'react-router-dom';
import './Login.css';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';


function Login(){
    let [username, setUsername] = React.useState("");
    let [password, setPassword] = React.useState("");
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const Navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        const foundUser = users.find((user) => user.username === username && user.password === password);
        if(foundUser){
            dispatch(loginUser(foundUser));
            Navigate("/dashboard");
        } else {
            alert("Invalid username or password");
        }
    }


    return(
        <div className="login-container">
            <div className="login-left-section">
                <img src={loginCover} alt="login"/>
            </div>
            <div className="login-right-section">
            <h1>Login</h1>
                <div className="login-form-box">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                        
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                        <button type="submit">Login</button>
                        <h6>Don't have an account? <Link to="/register">Register</Link></h6>
                    </form>
                </div>

            </div>

        </div>
    );
}
export default Login;