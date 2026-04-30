import Application from '../models/Application.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';
import Request from '../models/Request.js';
import asyncHandler from '../utils/asyncHandler.js';

export const applyToRequest = asyncHandler(async (req, res) => {
  if (req.user.role !== 'provider') {
    res.status(403);
    throw new Error('Only providers can apply to requests');
  }

  const request = await Request.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.createdBy.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot apply to your own request');
  }

  const existingApplication = await Application.findOne({
    requestId: request._id,
    providerId: req.user._id,
  });

  if (existingApplication) {
    res.status(409);
    throw new Error('You already applied to this request');
  }

  const application = await Application.create({
    requestId: request._id,
    providerId: req.user._id,
  });

  await Chat.findOneAndUpdate(
    { requestId: request._id, providerId: req.user._id },
    {
      $setOnInsert: {
        requestId: request._id,
        providerId: req.user._id,
        participants: [request.createdBy, req.user._id],
      },
    },
    { upsert: true, new: true },
  );

  const populatedApplication = await application.populate([
    { path: 'requestId', select: 'title description budget skills createdBy', populate: { path: 'createdBy', select: 'name email role' } },
    { path: 'providerId', select: 'name email role' },
  ]);

  await Notification.create({
    userId: request.createdBy,
    message: `New application received for your request: ${request.title}`,
    type: 'application',
  });

  res.status(201).json({
    success: true,
    application: populatedApplication,
  });
});

export const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ providerId: req.user._id })
    .populate({ path: 'requestId', select: 'title description budget skills createdBy', populate: { path: 'createdBy', select: 'name email role' } })
    .populate('providerId', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

export const getProviderApplications = getApplications;

export const getApplicationsForRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only view applications for your own requests');
  }

  const applications = await Application.find({ requestId: request._id })
    .populate({ path: 'requestId', select: 'title description budget skills createdBy', populate: { path: 'createdBy', select: 'name email role' } })
    .populate('providerId', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be pending, accepted, or rejected');
  }

  const application = await Application.findById(req.params.id).populate('requestId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.requestId.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only update applications for your own requests');
  }

  application.status = status;
  await application.save();

  await Notification.create({
    userId: application.providerId,
    message: `Your application has been ${status}`,
    type: 'status',
  });

  if (status === 'accepted') {
    const rejectedApplications = await Application.find({
      requestId: application.requestId._id,
      _id: { $ne: application._id },
      status: 'pending',
    });

    await Application.updateMany(
      {
        requestId: application.requestId._id,
        _id: { $ne: application._id },
        status: 'pending',
      },
      { $set: { status: 'rejected' } },
    );

    await Notification.insertMany(rejectedApplications.map((rejectedApplication) => ({
      userId: rejectedApplication.providerId,
      message: 'Your application has been rejected',
      type: 'status',
    })));
  }

  const populatedApplication = await application.populate([
    { path: 'requestId', select: 'title description budget skills createdBy', populate: { path: 'createdBy', select: 'name email role' } },
    { path: 'providerId', select: 'name email role' },
  ]);

  res.status(200).json({
    success: true,
    application: populatedApplication,
  });
});
