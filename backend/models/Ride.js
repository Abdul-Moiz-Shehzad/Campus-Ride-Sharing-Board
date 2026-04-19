const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: true,
    },
    createdBy: {
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
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Car', 'Bike', 'Van', 'SUV'],
    },
    contactInfo: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
