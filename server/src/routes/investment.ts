import express from 'express';
import { authMiddleware } from '../middleware/auth';
import * as investmentController from '../controllers/investmentController';

const router = express.Router();

router.use(authMiddleware);

router.get('/', investmentController.getUserInvestments);
router.post('/', investmentController.createInvestment);
router.get('/:id', investmentController.getInvestment);
router.put('/:id', investmentController.updateInvestment);
router.delete('/:id', investmentController.deleteInvestment);

export default router;
