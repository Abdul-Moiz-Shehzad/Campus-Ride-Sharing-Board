import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage
const loadUserFromStorage = () => {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error loading user from localStorage:', error);
        return null;
    }
};

const initialState = {
    users: [],
    currentUser: loadUserFromStorage(),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        registerUser: (state, action) => {
            state.users.push(action.payload);
        },

        loginUser: (state, action) => {
            state.currentUser = action.payload;
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        },

        logoutUser: (state) => {
            state.currentUser = null;
            // Remove from localStorage
            localStorage.removeItem('currentUser');
        },

        updateProfile: (state, action) => {
            const { id, username, phone, password } = action.payload;

            const user = state.users.find((u) => u.id === id);

            if (user) {
                user.username = username;
                user.phone = phone;
                user.password = password;
            }

            if (state.currentUser && state.currentUser.id === id) {
                state.currentUser.username = username;
                state.currentUser.phone = phone;
                state.currentUser.password = password;
                // Update localStorage
                localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
            }
        }
    }
});

export const { registerUser, loginUser, logoutUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;