import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rides: [],
    bookings: [],
    requests: []
};

const rideSlice = createSlice({
    name: "ride",
    initialState,
    reducers: {
        setRides: (state, action) => {
            state.rides = action.payload;
        },

        setRequests: (state, action) => {
            state.requests = action.payload;
        },

        addRide: (state, action) => {
            state.rides.push(action.payload);
        },

        requestRide: (state, action) => {
            state.requests.push(action.payload);
        },

        bookRide: (state, action) => {
            const { rideId, userId } = action.payload;

            const ride = state.rides.find(r => r.id === rideId || r._id === rideId);
            if (!ride) return;

            if (ride.createdBy === userId || ride.createdBy?._id === userId) return;

            if (ride.availableSeats <= 0) return;

            const alreadyBooked = state.bookings.find(
                booking =>
                    booking.type === "ride" &&
                    (booking.rideId === rideId || booking.rideId?._id === rideId) &&
                    booking.userId === userId
            );

            if (alreadyBooked) return;

            ride.availableSeats = ride.availableSeats - 1;

            state.bookings.push({
                id: Date.now(),
                type: "ride",
                rideId: ride.id || ride._id,
                userId: userId,
                ownerId: ride.createdBy,
                pickup: ride.pickup,
                destination: ride.destination,
                departureTime: ride.departureTime,
                vehicleType: ride.vehicleType
            });
        },

        bookRequest: (state, action) => {
            const { requestId, userId } = action.payload;

            const request = state.requests.find(r => r.id === requestId || r._id === requestId);
            if (!request) return;

            if (request.userId === userId || request.userId?._id === userId) return;

            if (request.status === "fulfilled") return;

            const alreadyBooked = state.bookings.find(
                booking =>
                    booking.type === "request" &&
                    (booking.requestId === requestId || booking.requestId?._id === requestId) &&
                    booking.userId === userId
            );

            if (alreadyBooked) return;

            request.status = "fulfilled";
            request.fulfilledBy = userId;

            state.bookings.push({
                id: Date.now(),
                type: "request",
                requestId: request.id || request._id,
                userId: userId,
                ownerId: request.userId,
                pickup: request.pickup,
                destination: request.destination,
                departureTime: request.departureTime,
                vehicleType: request.vehicleType
            });
        },

        updateUserInfoInPosts: (state, action) => {
            const { userId, username, phone } = action.payload;

            state.rides.forEach((ride) => {
                if (ride.createdBy === userId || ride.createdBy?._id === userId) {
                    ride.driverName = username;
                    ride.contactInfo = phone;
                }
            });

            state.requests.forEach((request) => {
                if (request.userId === userId || request.userId?._id === userId) {
                    request.name = username;
                    request.phone = phone;
                }
            });
        }
    }
});

export const {
    setRides,
    setRequests,
    addRide,
    requestRide,
    bookRide,
    bookRequest,
    updateUserInfoInPosts
} = rideSlice.actions;

export default rideSlice.reducer;