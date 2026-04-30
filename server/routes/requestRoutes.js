import express from 'express';
import { createRequest, deleteRequest, getRequestById, getRequests, getUserRequests } from '../controllers/requestController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('user'), createRequest)
  .get(getRequests);

router.get('/user', protect, authorizeRoles('user'), getUserRequests);

router.route('/:id')
  .get(getRequestById)
  .delete(protect, deleteRequest);

export default router;
