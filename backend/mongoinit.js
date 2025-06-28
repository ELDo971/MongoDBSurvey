import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './db/models/user_schema.js';
import Survey from './db/models/survey_schema.js';
import Response from './db/models/response_schema.js';
import { faker } from '@faker-js/faker';


dotenv.config();

async function initAndSeed() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB Atlas');
  
      await User.init();
      await Survey.init();
      await Response.init();
      console.log('Models initialized');
  
      // Create fake users
      const users = [];
      for (let i = 0; i < 5; i++) {
        const user = new User({
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: faker.internet.password(10),
          role: 'user'
        });
        await user.save();
        users.push(user);
      }
  
      // Create fake surveys
      const surveys = [];
      for (let i = 0; i < 3; i++) {
        const survey = new Survey({
          nom: faker.lorem.words(3),
          description:faker.lorem.sentence(20),
          createur: users[i % users.length]._id,
          questions: [
            {
              intitule: faker.lorem.sentence(6),
              type: 'ouverte'
            },
            {
              intitule: faker.lorem.sentence(6),
              type: 'qcm',
              reponses: [
                faker.lorem.word(),
                faker.lorem.word(),
                faker.lorem.word(),
                faker.lorem.word()
              ]
            }
          ]
        });
        await survey.save();
        surveys.push(survey);
      }
  
      // Create fake responses
      for (const survey of surveys) {
        for (const user of users) {
          const response = new Response({
            sondage_id: survey._id,
            utilisateur_id: user._id,
            reponses: [
              {
                question_id: survey.questions[0]._id,
                reponse: faker.lorem.sentence(4)
              },
              {
                question_id: survey.questions[1]._id,
                reponse: [faker.lorem.word(), faker.lorem.word()]
              }
            ]
          });
          await response.save();
        }
      }
  
      console.log('Fake data inserted');
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  }
  
  initAndSeed();