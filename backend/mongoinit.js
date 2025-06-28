import mongoose from "mongoose";
import dotenv from "dotenv";
import Survey from "./db/models/survey_schema.js";
import Response from "./db/models/response_schema.js";
import { faker } from "@faker-js/faker";

dotenv.config();

async function initAndSeed() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    // 2. Initialize models
    await Promise.all([Survey.init(), Response.init()]);
    console.log("✅ Models initialized");

    // 3. Fetch existing users
    const users = await mongoose.connection
      .collection("users")
      .find()
      .toArray();
    if (users.length === 0) {
      throw new Error("No users found. Please create users first.");
    }

    // 4. Create surveys
    const surveys = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        const creator = users[i % users.length];
        const survey = new Survey({
          nom: faker.lorem.words(3),
          description: faker.lorem.sentence(20),
          createur: creator._id,
          questions: [
            {
              intitule: faker.lorem.sentence(6),
              type: "ouverte",
            },
            {
              intitule: faker.lorem.sentence(6),
              type: "qcm",
              reponses: Array.from({ length: 4 }, () => faker.lorem.word()),
            },
          ],
        });
        return survey.save();
      })
    );
    console.log(`📝 Created ${surveys.length} surveys`);

    // 5. Create responses
    let responseCount = 0;
    for (const survey of surveys) {
      for (const user of users) {
        const response = new Response({
          sondage_id: survey._id,
          utilisateur_id: user._id,
          reponses: survey.questions.map((question, idx) => ({
            question_id: question._id,
            reponse:
              question.type === "ouverte"
                ? faker.lorem.sentence(4)
                : [faker.lorem.word(), faker.lorem.word()],
          })),
        });
        await response.save();
        responseCount++;
      }
    }
    console.log(`📊 Created ${responseCount} responses`);

    // 6. Cleanup
    await mongoose.disconnect();
    console.log("✅ Fake data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

initAndSeed();
