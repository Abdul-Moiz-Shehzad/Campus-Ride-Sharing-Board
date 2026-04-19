const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
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
      enum: ['Car', 'Bike', 'Van', 'SUV'],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'cancelled'],
      default: 'open',
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RideRequest', rideRequestSchema);
