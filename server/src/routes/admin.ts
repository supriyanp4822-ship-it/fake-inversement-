import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// Apply auth and admin check to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/reports', adminController.getReports);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/block', adminController.toggleUserBlock);
router.patch('/reports/:id/status', adminController.updateReportStatus);

export default router;
