import express from 'express';
import {
  submitResponse,
  getResponsesBySurvey,
  getMyResponses
} from '../controllers/response.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', submitResponse); // Public: anyone can submit
router.get('/survey/:surveyId', /*verifyToken*/ getResponsesBySurvey); // Owner only (add owner check in controller if needed)
router.get('/mine', verifyToken, getMyResponses); // Authenticated user

export default router;
