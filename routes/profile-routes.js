import express from 'express';
import profileController from '../controllers/profile-controller.js';

const router = express.Router();

router.post('/', profileController.setInfo);

const profileRoutes = router;

export default profileRoutes;
