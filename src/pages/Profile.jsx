import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../redux/userSlice";
import "./Profile.css";

function Profile() {
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!currentUser) {
            alert("Please Login First");
            navigate("/login");
            return;
        }

        setUsername(currentUser.username || "");
        setPhone(currentUser.phone || "");
        setPassword(currentUser.password || "");
        setConfirmPassword(currentUser.password || "");
    }, [currentUser, navigate]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!username || !phone || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const updatedUser = {
            id: currentUser.id,
            username: username,
            phone: phone,
            password: password
        };

        dispatch(updateProfile(updatedUser));
        alert("Profile updated successfully");
        navigate("/dashboard");
    }

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            <div className="profile-box">
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;