import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

applicationSchema.index({ requestId: 1, providerId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
