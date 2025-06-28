import express from 'express'
import cors from 'cors'
import authRoutes from './routers/auth.routes.js';
import surveyRoutes from './routers/survey.routes.js';
import responseRoutes from './routers/responses.routes.js';


const app = express()

app.use(cors());
app.use(express.json());


app.use('/api/surveys', surveyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/responses',responseRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' });
  });

app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    })
})

// Export the app to be used in the server
export default app