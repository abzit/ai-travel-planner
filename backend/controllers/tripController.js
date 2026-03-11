const Trip = require('../models/Trip');
const { generateItinerary, regenerateDay } = require('../services/aiService');

// @desc    Generate a new trip itinerary
// @route   POST /api/trips/generate
// @access  Private
const generateTrip = async (req, res) => {
  try {
    const { destination, days, budgetType, interests } = req.body;

    if (!destination || !days || !budgetType || !interests) {
        return res.status(400).json({ message: 'Please provide all trip details' });
    }

    // Call AI Service
    const aiData = await generateItinerary(destination, days, budgetType, interests);

    // Save to DB
    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      days,
      budgetType,
      interests,
      itinerary: aiData.itinerary,
      budgetEstimate: aiData.budgetEstimate,
      currency: aiData.currencyCode,
      currencySymbol: aiData.currencySymbol,
      hotels: aiData.hotels,
      mapLocations: aiData.mapLocations || [],
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate trip', error: error.message });
  }
};

// @desc    Get user trips
// @route   GET /api/trips/my-trips
// @access  Private
const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

// @desc    Get specific trip
// @route   GET /api/trips/:tripId
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check user
    if (trip.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trip' });
  }
};

// @desc    Add activity to a day
// @route   PATCH /api/trips/:tripId/add-activity
// @access  Private
const addActivity = async (req, res) => {
    try {
        const { day, activity } = req.body;
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const dayToUpdate = trip.itinerary.find(d => d.day === day);
        if (dayToUpdate) {
            dayToUpdate.activities.push(activity);
            await trip.save();
            res.status(200).json(trip);
        } else {
            res.status(404).json({ message: 'Day not found in itinerary' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add activity' });
    }
};

// @desc    Remove activity from a day
// @route   DELETE /api/trips/:tripId/remove-activity
// @access  Private
const removeActivity = async (req, res) => {
    try {
        const { day, activity } = req.body;
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const dayToUpdate = trip.itinerary.find(d => d.day === day);
        if (dayToUpdate) {
            dayToUpdate.activities = dayToUpdate.activities.filter(a => a !== activity);
            await trip.save();
            res.status(200).json(trip);
        } else {
            res.status(404).json({ message: 'Day not found in itinerary' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove activity' });
    }
};

// @desc    Regenerate a specific day using AI
// @route   POST /api/trips/:tripId/regenerate-day
// @access  Private
const regenerateTripDay = async (req, res) => {
    try {
        const { day } = req.body;
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const dayToRegenerate = trip.itinerary.find(d => d.day === day);
        if (!dayToRegenerate) return res.status(404).json({ message: 'Day not found' });

        const newActivities = await regenerateDay(trip.destination, day, trip.interests, dayToRegenerate.activities);
        
        dayToRegenerate.activities = newActivities;
        await trip.save();

        res.status(200).json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to regenerate day' });
    }
};

// @desc    Generate a guest trip (no auth, no DB save)
// @route   POST /api/trips/generate-guest
// @access  Public
const generateGuestTrip = async (req, res) => {
  try {
    const { destination, days, budgetType, interests } = req.body;

    if (!destination || !days || !budgetType || !interests) {
      return res.status(400).json({ message: 'Please provide all trip details' });
    }

    // Call AI Service
    const aiData = await generateItinerary(destination, days, budgetType, interests);

    // Return directly without saving to DB
    res.status(200).json({
      destination,
      days,
      budgetType,
      interests,
      itinerary: aiData.itinerary,
      budgetEstimate: aiData.budgetEstimate,
      currency: aiData.currencyCode,
      currencySymbol: aiData.currencySymbol,
      hotels: aiData.hotels,
      mapLocations: aiData.mapLocations || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate trip', error: error.message });
  }
};

module.exports = {
  generateTrip,
  generateGuestTrip,
  getUserTrips,
  getTripById,
  addActivity,
  removeActivity,
  regenerateTripDay
};
