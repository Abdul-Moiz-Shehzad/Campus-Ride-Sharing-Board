import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    currentUser: null,
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
        },

        logoutUser: (state) => {
            state.currentUser = null;
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
            }
        }
    }
});

export const { registerUser, loginUser, logoutUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;