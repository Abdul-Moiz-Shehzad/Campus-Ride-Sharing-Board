const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, departureTime, availableSeats, vehicleType, notes } = req.body;
    if (!pickup || !destination || !departureTime || !availableSeats || !vehicleType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await require('../models/User').findById(req.user.id);

    const ride = new Ride({
      driverName: user.username,
      createdBy: req.user.id,
      pickup,
      destination,
      departureTime,
      availableSeats: Number(availableSeats),
      vehicleType,
      contactInfo: user.phone,
      notes,
    });

    await ride.save();

    res.status(201).json({
      message: 'Ride posted successfully',
      ride,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'active' })
      .populate('createdBy', 'username phone')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('createdBy', 'username phone');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this ride' });
    }

    const { availableSeats, notes, status } = req.body;

    if (availableSeats !== undefined) ride.availableSeats = availableSeats;
    if (notes !== undefined) ride.notes = notes;
    if (status !== undefined) ride.status = status;

    await ride.save();

    res.json({
      message: 'Ride updated successfully',
      ride,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this ride' });
    }

    await Ride.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ rideId: req.params.id });

    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot book your own ride' });
    }

    if (ride.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const alreadyBooked = await Booking.findOne({
      type: 'ride',
      rideId,
      userId: req.user.id,
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: 'You have already booked this ride' });
    }

    ride.availableSeats -= 1;
    await ride.save();

    const booking = new Booking({
      type: 'ride',
      rideId,
      userId: req.user.id,
      ownerId: ride.createdBy,
      pickup: ride.pickup,
      destination: ride.destination,
      departureTime: ride.departureTime,
      vehicleType: ride.vehicleType,
    });

    await booking.save();

    res.status(201).json({
      message: 'Ride booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ type: 'ride', userId: req.user.id })
      .populate('rideId')
      .populate('ownerId', 'username phone');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
