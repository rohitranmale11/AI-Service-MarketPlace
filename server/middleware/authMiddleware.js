import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user no longer exists');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error(error.name === 'TokenExpiredError' ? 'Token expired' : 'Not authorized, token invalid');
  }
});

export const protect = verifyToken;

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('You do not have permission to access this resource');
  }

  next();
};

export const allowOnly = authorizeRoles;
