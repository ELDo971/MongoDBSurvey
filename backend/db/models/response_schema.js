import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  reponse: { type: mongoose.Schema.Types.Mixed, required: true } // string or array of strings
});

const ResponseSchema = new mongoose.Schema({
  sondage_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  reponses: [AnswerSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Response', ResponseSchema);
