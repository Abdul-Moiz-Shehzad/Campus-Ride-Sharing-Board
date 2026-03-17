import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../redux/userSlice";
import { updateUserInfoInPosts } from "../redux/rideSlice";
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
            username,
            phone,
            password
        };

        dispatch(updateProfile(updatedUser));
        dispatch(updateUserInfoInPosts({
            userId: currentUser.id,
            username,
            phone
        }));

        alert("Profile updated successfully");
        navigate("/dashboard");
    }

    return (
        <div className="profile-page">
            <div className="profile-topbar">
                <div>
                    <h1>My Profile</h1>
                    <p className="profile-subtitle">Update your personal information</p>
                </div>

                <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
            </div>


            <div className="profile-card">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {username ? username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h3>{username}</h3>
                    <p className="profile-phone"><a href={`tel:${phone}`}>{phone}</a></p>
                </div>


                <form className="profile-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label>Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;