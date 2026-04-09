const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceName: {
    type: String,
    enum: ['dog_walking', 'grooming', 'pet_sitting', 'pet_training', 'vet_consultation'],
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
  },
  availableDays: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
  maxPetsPerBooking: {
    type: Number,
    default: 1,
  },
  serviceImages: [String],
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', ServiceSchema);