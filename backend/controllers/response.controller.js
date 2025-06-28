import Response from '../db/models/response_schema.js';

// Submit answers to a survey (public or authenticated)
export const submitResponse = async (req, res) => {
  try {
    const { sondage_id, reponses } = req.body;
    const utilisateur_id = req.user ? req.user.id : undefined; // If authenticated

    const response = new Response({
      sondage_id,
      utilisateur_id,
      reponses
    });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: 'Could not submit response', error: err.message });
  }
};

// Get all responses for a survey (owner only)
export const getResponsesBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const responses = await Response.find({ sondage_id: surveyId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all responses by the current user (authenticated)
export const getMyResponses = async (req, res) => {
  try {
    const responses = await Response.find({ utilisateur_id: req.user.id });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
