import Application from '../models/Application.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const recalculateProviderRating = async (providerId) => {
  const providerObjectId = new mongoose.Types.ObjectId(providerId);
  const stats = await Review.aggregate([
    { $match: { providerId: providerObjectId } },
    {
      $group: {
        _id: '$providerId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const rating = stats[0]?.averageRating || 0;
  const totalReviews = stats[0]?.totalReviews || 0;

  await User.findByIdAndUpdate(providerId, {
    rating: Number(rating.toFixed(1)),
    totalReviews,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  const { providerId, rating, comment } = req.body;

  if (req.user.role !== 'user') {
    res.status(403);
    throw new Error('Only users can review providers');
  }

  if (!providerId || rating === undefined) {
    res.status(400);
    throw new Error('Provider and rating are required');
  }

  const numericRating = Number(rating);

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be an integer between 1 and 5');
  }

  const provider = await User.findOne({ _id: providerId, role: 'provider' });

  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  const acceptedApplication = await Application.findOne({
    providerId,
    status: 'accepted',
  }).populate('requestId');

  const hasAcceptedWork = acceptedApplication?.requestId?.createdBy?.toString() === req.user._id.toString();

  if (!hasAcceptedWork) {
    res.status(403);
    throw new Error('You can only review providers after accepting their application');
  }

  const existingReview = await Review.findOne({ providerId, userId: req.user._id });

  if (existingReview) {
    res.status(409);
    throw new Error('You already reviewed this provider');
  }

  const review = await Review.create({
    providerId,
    userId: req.user._id,
    rating: numericRating,
    comment,
  });

  await recalculateProviderRating(provider._id);

  const populatedReview = await review.populate('userId', 'name profileImage role');

  res.status(201).json({
    success: true,
    review: populatedReview,
  });
});

export const getProviderReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ providerId: req.params.providerId })
    .populate('userId', 'name profileImage role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});
