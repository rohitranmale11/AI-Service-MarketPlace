import Request from '../models/Request.js';
import Application from '../models/Application.js';
import asyncHandler from '../utils/asyncHandler.js';

const normalizeSkills = (skills = []) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => String(skill).trim())
    .filter(Boolean);
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildRequestQuery = ({ keyword, minBudget, maxBudget, skills }) => {
  const query = {};

  if (keyword?.trim()) {
    const searchRegex = new RegExp(escapeRegex(keyword.trim()), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
    ];
  }

  if (minBudget !== undefined || maxBudget !== undefined) {
    query.budget = {};

    if (minBudget !== undefined) {
      const min = Number(minBudget);

      if (Number.isNaN(min) || min < 0) {
        throw new Error('minBudget must be a valid positive number');
      }

      query.budget.$gte = min;
    }

    if (maxBudget !== undefined) {
      const max = Number(maxBudget);

      if (Number.isNaN(max) || max < 0) {
        throw new Error('maxBudget must be a valid positive number');
      }

      query.budget.$lte = max;
    }
  }

  if (skills?.trim()) {
    const skillList = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skillList.length) {
      query.skills = { $in: skillList.map((skill) => new RegExp(`^${escapeRegex(skill)}$`, 'i')) };
    }
  }

  return query;
};

export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, budget, skills } = req.body;

  if (!title || !description || budget === undefined) {
    res.status(400);
    throw new Error('Title, description, and budget are required');
  }

  const numericBudget = Number(budget);

  if (Number.isNaN(numericBudget) || numericBudget <= 0) {
    res.status(400);
    throw new Error('Budget must be a number greater than zero');
  }

  const request = await Request.create({
    title,
    description,
    budget: numericBudget,
    skills: normalizeSkills(skills),
    createdBy: req.user._id,
  });

  const populatedRequest = await request.populate('createdBy', 'name email role');

  res.status(201).json({
    success: true,
    request: populatedRequest,
  });
});

export const getRequests = asyncHandler(async (req, res) => {
  let query;

  try {
    query = buildRequestQuery(req.query);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const requests = await Request.find(query)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

export const getUserRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ createdBy: req.user._id })
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).populate('createdBy', 'name email role');

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  res.status(200).json({
    success: true,
    request,
  });
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete requests you created');
  }

  await Application.deleteMany({ requestId: request._id });
  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Request deleted successfully',
  });
});
