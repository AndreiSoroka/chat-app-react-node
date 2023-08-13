import express from 'express';
import * as messageController from '../controllers/messageController.mjs';

const router = express.Router();

router.get('/message/list', messageController.listMessages);
router.post('/message', messageController.addMessage);

export default router;
