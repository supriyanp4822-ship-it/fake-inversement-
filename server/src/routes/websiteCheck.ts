import express from 'express';
import { checkWebsite } from '../controllers/websiteCheckController';

const router = express.Router();

router.post('/', checkWebsite);

export default router;
