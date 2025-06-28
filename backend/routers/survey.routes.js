import express from 'express';
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  getMySurveys
} from '../controllers/survey.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/', getAllSurveys);                // Public
router.get('/mine', verifyToken, getMySurveys); // Authenticated
router.get('/:id', getSurveyById);             // see survey answer 
router.post('/', verifyToken, createSurvey);   // Authenticated
router.put('/:id', verifyToken, updateSurvey); // Owner only
router.delete('/:id', verifyToken, deleteSurvey); // Owner only



export default router;
