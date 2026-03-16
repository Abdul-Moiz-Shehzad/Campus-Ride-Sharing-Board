import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rides: [
        {
            id: 1,
            driverName: "Ali",
            createdBy: 101,
            pickup: "Valencia Town",
            destination: "FAST",
            departureTime: "08:30",
            availableSeats: 3,
            vehicleType: "Car",
            contactInfo: "0300-1234567",
            notes: "Leaving sharp at 8:30"
        },
        {
            id: 2,
            driverName: "Umer",
            createdBy: 102,
            pickup: "Johar Town",
            destination: "Faisal Town",
            departureTime: "09:00",
            availableSeats: 1,
            vehicleType: "Bike",
            contactInfo: "0311-9876543",
            notes: "Only small bags please"
        }
    ],
    bookings: [],
    requests: []
};

const rideSlice = createSlice({
    name: "ride",
    initialState,
    reducers: {
        addRide: (state, action) => {
            state.rides.push(action.payload);
        },

        requestRide: (state, action) => {
            state.requests.push(action.payload);
        },

        bookRide: (state, action) => {
            const { rideId, userId } = action.payload;

            const ride = state.rides.find(r => r.id === rideId);
            if (!ride) return;

            if (ride.createdBy === userId) return;

            if (ride.availableSeats <= 0) return;

            const alreadyBooked = state.bookings.find(
                booking =>
                    booking.type === "ride" &&
                    booking.rideId === rideId &&
                    booking.userId === userId
            );

            if (alreadyBooked) return;

            ride.availableSeats = ride.availableSeats - 1;

            state.bookings.push({
                id: Date.now(),
                type: "ride",
                rideId: ride.id,
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

            const request = state.requests.find(r => r.id === requestId);
            if (!request) return;

            if (request.userId === userId) return;

            if (request.status === "fulfilled") return;

            const alreadyBooked = state.bookings.find(
                booking =>
                    booking.type === "request" &&
                    booking.requestId === requestId &&
                    booking.userId === userId
            );

            if (alreadyBooked) return;

            request.status = "fulfilled";
            request.fulfilledBy = userId;

            state.bookings.push({
                id: Date.now(),
                type: "request",
                requestId: request.id,
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
                if (ride.createdBy === userId) {
                    ride.driverName = username;
                    ride.contactInfo = phone;
                }
            });

            state.requests.forEach((request) => {
                if (request.userId === userId) {
                    request.name = username;
                    request.phone = phone;
                }
            });
        }
    }
});

export const {
    addRide,
    requestRide,
    bookRide,
    bookRequest,
    updateUserInfoInPosts
} = rideSlice.actions;

export default rideSlice.reducer;