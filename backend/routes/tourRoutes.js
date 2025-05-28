const express = require("express");
const {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, createTour).get(protect, getTours);

router
  .route("/:id")
  .get(protect, getTourById)
  .put(protect, updateTour)
  .delete(protect, deleteTour);

module.exports = router;
