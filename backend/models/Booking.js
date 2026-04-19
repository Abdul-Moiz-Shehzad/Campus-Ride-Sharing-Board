const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ride', 'request'],
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      default: null,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RideRequest',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
