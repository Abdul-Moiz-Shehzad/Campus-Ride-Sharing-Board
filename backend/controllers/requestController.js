const RideRequest = require('../models/RideRequest');
const Booking = require('../models/Booking');

exports.createRequest = async (req, res) => {
  try {
    const { pickup, destination, departureTime, vehicleType, notes } = req.body;

    if (!pickup || !destination || !departureTime || !vehicleType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await require('../models/User').findById(req.user.id);

    const request = new RideRequest({
      userId: req.user.id,
      name: user.username,
      phone: user.phone,
      pickup,
      destination,
      departureTime,
      vehicleType,
      notes,
    });

    await request.save();

    res.status(201).json({
      message: 'Ride request submitted',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RideRequest.find({ status: 'open' })
      .populate('userId', 'username phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id).populate('userId', 'username phone');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    const { notes, status } = req.body;

    if (notes !== undefined) request.notes = notes;
    if (status !== undefined) request.status = status;

    await request.save();

    res.json({
      message: 'Request updated successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await RideRequest.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ requestId: req.params.id });

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fulfillRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await RideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.userId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot respond to your own request' });
    }

    if (request.status === 'fulfilled') {
      return res.status(400).json({ message: 'This request has already been fulfilled' });
    }

    const alreadyResponded = await Booking.findOne({
      type: 'request',
      requestId,
      userId: req.user.id,
    });

    if (alreadyResponded) {
      return res.status(400).json({ message: 'You have already responded to this request' });
    }

    request.status = 'fulfilled';
    request.fulfilledBy = req.user.id;
    await request.save();

    const booking = new Booking({
      type: 'request',
      requestId,
      userId: req.user.id,
      ownerId: request.userId,
      pickup: request.pickup,
      destination: request.destination,
      departureTime: request.departureTime,
      vehicleType: request.vehicleType,
    });

    await booking.save();

    res.status(201).json({
      message: 'Request fulfilled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserResponses = async (req, res) => {
  try {
    const bookings = await Booking.find({ type: 'request', userId: req.user.id })
      .populate('requestId')
      .populate('ownerId', 'username phone');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
