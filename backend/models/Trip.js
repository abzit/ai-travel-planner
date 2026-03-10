const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  day: { type: Number, required: true },
  activities: [{ type: String }],
});

const tripSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    budgetType: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    interests: [{ type: String }],
    itinerary: [activitySchema],
    budgetEstimate: {
      flights: { type: Number },
      accommodation: { type: Number },
      food: { type: Number },
      activities: { type: Number },
      total: { type: Number },
    },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    hotels: [
      {
        name: { type: String },
        type: { type: String },
      },
    ],
    mapLocations: [
      {
        name: { type: String },
        lat: { type: Number },
        lng: { type: Number }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
