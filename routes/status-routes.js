import express from 'express';
import statusController from '../controllers/status-controller.js';

const router = express.Router();

router.get('/', statusController.health);

const statusRoutes = router;

export default statusRoutes;
