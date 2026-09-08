import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import * as reportController from '../controllers/reportController';

const router = express.Router();

// Allow public/open tracking of reports by reportId/trackingId
router.get('/track/:trackingId', reportController.trackReport);

router.use(authMiddleware);

router.get('/', reportController.getUserReports);
router.post('/', reportController.generateReport);
router.get('/:id', reportController.getReport);

// Only admins can update report status directly
router.patch('/:id/status', adminMiddleware, reportController.updateStatus);

export default router;
