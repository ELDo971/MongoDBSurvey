import Survey from '../db/models/survey_schema.js';

// Get all surveys (public)
export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find().populate('createur', 'username');
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific survey by ID (public)
export const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate('createur', 'username');
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new survey (authenticated)
export const createSurvey = async (req, res) => {
  try {
    const { nom, questions } = req.body;
    const createur = req.user.id; // Assumes req.user is set by auth middleware
    const survey = new Survey({ nom, createur, questions });
    await survey.save();
    res.status(201).json(survey);
  } catch (err) {
    res.status(400).json({ message: 'Could not create survey', error: err.message });
  }
};

// Update a survey (owner only)
export const updateSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    if (survey.createur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    Object.assign(survey, req.body);
    await survey.save();
    res.json(survey);
  } catch (err) {
    res.status(400).json({ message: 'Could not update survey', error: err.message });
  }
};

// Delete a survey (owner only)
export const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    if (survey.createur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await survey.deleteOne();
    res.json({ message: 'Survey deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete survey', error: err.message });
  }
};

// Get surveys by current user (authenticated)
export const getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ createur: req.user.id });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
