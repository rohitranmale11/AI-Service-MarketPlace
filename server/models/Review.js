import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
      default: '',
    },
  },
  { timestamps: true },
);

reviewSchema.index({ providerId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ providerId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
