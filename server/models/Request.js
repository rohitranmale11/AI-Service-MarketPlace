import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [1, 'Budget must be greater than zero'],
    },
    skills: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

requestSchema.index({ title: 'text', description: 'text' });
requestSchema.index({ budget: 1 });
requestSchema.index({ skills: 1 });
requestSchema.index({ createdAt: -1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
