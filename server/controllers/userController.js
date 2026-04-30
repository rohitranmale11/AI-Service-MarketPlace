import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const normalizeSkills = (skills = []) => (
  Array.isArray(skills)
    ? skills.map((skill) => String(skill).trim()).filter(Boolean)
    : String(skills).split(',').map((skill) => skill.trim()).filter(Boolean)
);

const userFields = 'name email role profileImage bio skills rating totalReviews createdAt';

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(userFields);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, profileImage, bio, skills } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (profileImage !== undefined) updates.profileImage = profileImage;
  if (bio !== undefined) updates.bio = bio;
  if (skills !== undefined) updates.skills = normalizeSkills(skills);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true },
  ).select(userFields);

  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(userFields);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user,
  });
});
