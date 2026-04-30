import express from 'express';
import { applyToRequest, getApplications, getApplicationsForRequest, getProviderApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply/:requestId', protect, authorizeRoles('provider'), applyToRequest);
router.get('/applications', protect, authorizeRoles('provider'), getApplications);
router.get('/applications/provider', protect, authorizeRoles('provider'), getProviderApplications);
router.get('/applications/request/:requestId', protect, authorizeRoles('user'), getApplicationsForRequest);
router.patch('/applications/:id/status', protect, authorizeRoles('user'), updateApplicationStatus);

export default router;
