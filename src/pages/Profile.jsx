import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../redux/userSlice";
import { updateUserInfoInPosts } from "../redux/rideSlice";
import { userAPI } from "../api";
import "./Profile.css";

function Profile() {
    const currentUser = useSelector(state => state.user.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
            const response = await userAPI.updateProfile(username, phone, password, confirmPassword);

            if (!response.user) {
                alert(response.message || "Failed to update profile");
                setLoading(false);
                return;
            }

            const updatedUser = {
                id: response.user.id,
                username: response.user.username,
                phone: response.user.phone
            };

            dispatch(updateProfile(updatedUser));
            dispatch(updateUserInfoInPosts({
                userId: response.user.id,
                username: response.user.username,
                phone: response.user.phone
            }));

            alert("Profile updated successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
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

                    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;