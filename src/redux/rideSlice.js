import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rides: [
    {
      id: 1,
      driverName: "Ali",
      createdBy: 101,
      pickup: "Hostel A",
      destination: "Main Campus",
      departureTime: "08:30 AM",
      availableSeats: 3,
      vehicleType: "Car",
      contactInfo: "0300-1234567",
      notes: "Leaving sharp at 8:30"
    },
    {
      id: 2,
      driverName: "Sara",
      createdBy: 102,
      pickup: "City Center",
      destination: "Business School",
      departureTime: "09:00 AM",
      availableSeats: 2,
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

    bookRide: (state, action) => {
      const { rideId, userId } = action.payload;

      const ride = state.rides.find((r) => r.id === rideId);

      if (ride && ride.availableSeats > 0) {
        ride.availableSeats -= 1;

        state.bookings.push({
          id: Date.now(),
          rideId,
          userId
        });
      }
    },

    requestRide: (state, action) => {
      state.requests.push(action.payload);
    }
  }
});

export const { addRide, bookRide, requestRide } = rideSlice.actions;
export default rideSlice.reducer;