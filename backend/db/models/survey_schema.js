import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  intitule: { type: String, required: true },
  type: { type: String, enum: ['ouverte', 'qcm'], required: true },
  reponses: [{ type: String }], // optional for QCM
});

const SurveySchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
  createur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Survey', SurveySchema);
