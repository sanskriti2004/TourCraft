const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Tour = require("../models/tourModel");

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private
const createTour = asyncHandler(async (req, res) => {
  const { title, steps, isPublic } = req.body;

  if (!title || !steps || !steps.length) {
    res.status(400);
    throw new Error("Please provide title and steps");
  }

  const tour = new Tour({
    user: req.user._id,
    title,
    steps,
    isPublic: isPublic || false,
  });

  const createdTour = await tour.save();
  res.status(201).json(createdTour);
});

// @desc    Get all tours for logged in user
// @route   GET /api/tours
// @access  Private
const getTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ user: req.user._id });
  res.json(tours);
});

// @desc    Get a single tour by ID
// @route   GET /api/tours/:id
// @access  Private
const getTourById = asyncHandler(async (req, res) => {
  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid tour ID format");
  }

  const tour = await Tour.findById(req.params.id);

  if (tour && tour.user.toString() === req.user._id.toString()) {
    res.json(tour);
  } else {
    res.status(404);
    throw new Error("Tour not found or not authorized");
  }
});

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private
const updateTour = asyncHandler(async (req, res) => {
  const { title, steps, isPublic } = req.body;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid tour ID format");
  }

  const tour = await Tour.findById(req.params.id);

  if (tour && tour.user.toString() === req.user._id.toString()) {
    tour.title = title || tour.title;
    tour.steps = steps || tour.steps;
    tour.isPublic = isPublic !== undefined ? isPublic : tour.isPublic;

    const updatedTour = await tour.save();
    res.json(updatedTour);
  } else {
    res.status(404);
    throw new Error("Tour not found or not authorized");
  }
});

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private
const deleteTour = asyncHandler(async (req, res) => {
  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid tour ID format");
  }

  const tour = await Tour.findById(req.params.id);

  if (tour && tour.user.toString() === req.user._id.toString()) {
    await tour.remove();
    res.json({ message: "Tour removed" });
  } else {
    res.status(404);
    throw new Error("Tour not found or not authorized");
  }
});

module.exports = {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
};
