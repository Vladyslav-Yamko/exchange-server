import express from 'express';
import profileController from '../controllers/profile-controller.js';

const router = express.Router();

router.post('/', profileController.setInfo);
router.get('/:id', profileController.getInfo);

const profileRoutes = router;

export default profileRoutes;
