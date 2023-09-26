import express from 'express';
import profileController from '../controllers/profile-controller.js';

const router = express.Router();

router.post('/set-money/:id', profileController.setMoney);
router.get('/get-money/:id', profileController.getMoney);
router.post('/send-euro/:id', profileController.transferEURO);
router.post('/send-usd/:id', profileController.transferUSD);
router.post('/convert/', profileController.convertMoney);
router.get('/:id', profileController.getInfo);
router.post('/', profileController.setInfo);

const profileRoutes = router;

export default profileRoutes;
